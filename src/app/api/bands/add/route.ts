import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { Band } from "@/app/types/Band";
import { Location } from "@/app/types/Location";

export async function POST(request: Request) {
  try {
    const band = buildBand(await request.json());
    await validateBand(band);
    const hyrdatedBand = await hydrateLatLong(band);
    const ok = await createBand(hyrdatedBand);
    if (ok) {
      return NextResponse.json({ message: "OK!" }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Failed to persist new band." },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

async function validateBand(band: Band): Promise<void> {
  await validateFieldsPresent(
    ["Name", band.name],
    ["City", band.homeBase.city],
    ["State", band.homeBase.state],
    ["Country", band.homeBase.country],
    ["Spotify", band.socials.spotify],
    ["Bandcamp", band.socials.bandcamp],
    ["Instagram", band.socials.instagram],
    ["X", band.socials.twitter]
  );
  await validateNotExists(band);
  validateHomeBase(band.homeBase);
  validateSocials(
    ["Spotify", band.socials.spotify],
    ["Bandcamp", band.socials.bandcamp],
    ["Instagram", band.socials.instagram],
    ["X", band.socials.twitter]
  );
}

async function validateNotExists(band: Band): Promise<void> {
  const nameResult = await sql`
    SELECT * FROM bands WHERE LOWER(name) = LOWER(${band.name})
  `;
  if (nameResult.rowCount > 0) {
    return Promise.reject(new Error(`${band.name} already exists.`));
  }

  const bandcampResult = await sql`
    SELECT * FROM bands WHERE LOWER(bandcamp) = LOWER(${band.socials.bandcamp})
  `;
  if (bandcampResult.rowCount > 0) {
    const name = bandcampResult.rows[0].name;
    return Promise.reject(
      new Error(`Bandcamp URL already registered to ${name}.`)
    );
  }

  const twitterResult = await sql`
    SELECT * FROM bands WHERE LOWER(twitter) = LOWER(${band.socials.twitter})
  `;
  if (twitterResult.rowCount > 0) {
    const name = twitterResult.rows[0].name;
    return Promise.reject(
      new Error(`Twitter URL already registered to ${name}.`)
    );
  }

  const instagramResult = await sql`
    SELECT * FROM bands WHERE LOWER(instagram) = LOWER(${band.socials.instagram})
  `;
  if (instagramResult.rowCount > 0) {
    const name = instagramResult.rows[0].name;
    return Promise.reject(
      new Error(`Instagram URL already registered to ${name}.`)
    );
  }

  return Promise.resolve();
}

function validateFieldsPresent(...vals: string[][]) {
  for (const val of vals) {
    if (/^\s*$/.test(val[1])) {
      throw new Error(`${val[0]} is empty.`);
    }
  }
}

function validateHomeBase(location: Location) {
  if (location.city.length > 50) {
    throw new Error("City name too long, max size is 50 characters.");
  }
  if (location.state.length > 2) {
    throw new Error("State name too long, must be two letters.");
  }
  if (location.country.length > 2) {
    throw new Error("Country name too long, must be two letters.");
  }
}

function validateSocials(...vals: [string, string][]) {
  vals.forEach(([name, url]) => {
    if (name === "Spotify") {
      const spotifyRegex = /^https:\/\/open\.spotify\.com\/artist\//;
      if (!spotifyRegex.test(url)) {
        throw new Error(
          "Invalid Spotify URL. Must start with https://open.spotify.com/artist."
        );
      }
    } else if (name === "Bandcamp") {
      const bandcampRegex = /^https:\/\/[\w\-]+\.bandcamp\.com\/?$/;
      if (!bandcampRegex.test(url)) {
        throw new Error(
          "Invalid Bandcamp URL. Must look like https://<name>.bandcamp.com."
        );
      }
    } else if (name === "Instagram") {
      const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[\w\.]+\/?$/;
      if (!instagramRegex.test(url)) {
        throw new Error(
          "Invalid Instagram URL. Must look like https://www.instagram.com/<name>/."
        );
      }
    } else if (name === "X") {
      const xOrTwitterRegex = /^https:\/\/(x\.com|twitter\.com)\/\w+\/?$/;
      if (!xOrTwitterRegex.test(url)) {
        throw new Error(
          "Invalid X or Twitter URL. Must look like https://x.com/<name>/ or https://twitter.com/<name>/."
        );
      }
    }
  });
}

function buildBand(requestBody: any): Band {
  const { name, city, state, country, spotify, bandcamp, instagram, twitter } =
    requestBody;
  return {
    id: -1,
    name: name.trim(),
    homeBase: {
      city: city.trim(),
      state: state.trim().toUpperCase(),
      country: country.trim().toUpperCase(),
      latLong: { lat: 0, long: 0 },
    },
    socials: {
      spotify: spotify.trim(),
      bandcamp: bandcamp.trim(),
      instagram: instagram.trim(),
      twitter: twitter.trim(),
    },
  };
}

async function hydrateLatLong(band: Band): Promise<Band> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const home = band.homeBase;
  const address = encodeURIComponent(
    `${home.city}, ${home.state}, ${home.country}`
  );
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    return Promise.reject(
      new Error("No good matches for location. Is it a real place?")
    );
  }

  const data = await response.json();
  if (data.results.length === 0) {
    return Promise.reject(
      new Error("No good matches for location. Is it a real place?")
    );
  }

  const { lat, lng } = data.results[0].geometry.location;
  return Promise.resolve({
    ...band,
    homeBase: {
      ...band.homeBase,
      latLong: { lat, long: lng },
    },
  });
}

async function createBand(band: Band): Promise<boolean> {
  const result = await sql`
    INSERT INTO Bands (
        name,
        city,
        state,
        country,
        lat,
        long,
        spotify,
        bandcamp,
        instagram,
        twitter
    ) VALUES (
        ${band.name},
        ${band.homeBase.city},
        ${band.homeBase.state},
        ${band.homeBase.country},
        ${band.homeBase.latLong.lat},
        ${band.homeBase.latLong.long},
        ${band.socials.spotify},
        ${band.socials.bandcamp},
        ${band.socials.instagram},
        ${band.socials.twitter}
    );
  `;
  return result.rowCount === 1;
}