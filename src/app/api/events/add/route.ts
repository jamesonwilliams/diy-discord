import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { Event } from "@/app/types/Event";

export async function POST(request: Request) {
  try {
    const event = buildEvent(await request.json());
    await validateEvent(event);
    const hydratedEvent = await hydrateLatLong(event);
    const ok = await createEvent(hydratedEvent);
    if (ok) {
      return NextResponse.json({ message: "OK!" }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Failed to persist new event." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

async function validateEvent(event: Event): Promise<void> {
  validateNotNull(
    ["Title", event.title],
    ["Start date", event.startDate],
    ["End date", event.endDate],
    ["Image url", event.imageUrl],
    ["Ticket url", event.ticketUrl],
    ["Venue name", event.venueName],
    ["Venue location", event.venueLocation],
    ["Venue url", event.venueUrl],
    ["Band names", event.bandNames]
  );

  validateDates(event.startDate, event.endDate);

  await validateNotExists(event);

  validateBandNames(event.bandNames);

  validateUrls(event.imageUrl, event.ticketUrl, event.venueUrl);
}

async function validateUrls(...urls: string[]): Promise<void> {
  urls.forEach(async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      return Promise.reject(new Error(`Invalid URL: ${url}`));
    }
  });
}

function validateBandNames(bandNames: string[]) {
  if (bandNames.length === 0) {
    throw new Error("At least one band name is required");
  } else if (bandNames.length > 25) {
    throw new Error("No more than 25 band names are allowed");
  } else if (bandNames.some((name) => name.length > 100)) {
    throw new Error("Band names must be 100 characters or less");
  } else if (bandNames.some((name) => name.length < 2)) {
    throw new Error("Band names must be at least 2 characters long");
  }
}

async function validateNotExists(event: Event): Promise<void> {
  const result = await sql`
    SELECT * FROM events WHERE LOWER(title) = LOWER(${event.title})
        OR LOWER(ticket_url) = LOWER(${event.ticketUrl})
  `;
  if (result.rowCount > 0) {
    return Promise.reject(
      new Error("Event with that title or ticket URL already exists")
    );
  }
  return Promise.resolve();
}

function validateNotNull(...args: any[][]) {
  args.forEach((arg: string[]) => {
    if (arg[1] === null || arg[1] === undefined) {
      throw new Error(`${arg[0]} fields is required`);
    }
  });
}

function validateDates(startDate: Date, endDate: Date) {
  if (startDate < new Date()) {
    throw new Error("Start date must be in the future");
  } else if (endDate < startDate) {
    throw new Error("End date must be after start date");
  }
}

function buildEvent(requestBody: any): Event {
  const {
    title,
    startDate,
    endDate,
    imageUrl,
    ticketUrl,
    venueName,
    venueLocation,
    venueUrl,
    bandNames,
  } = requestBody;
  return {
    id: -1,
    title: title.trim(),
    startDate: new Date(startDate.trim()),
    endDate: new Date(endDate.trim()),
    imageUrl: imageUrl.trim(),
    ticketUrl: ticketUrl.trim(),
    venueName: venueName.trim(),
    venueLocation: venueLocation.trim(),
    venueUrl: venueUrl.trim(),
    venueLat: 0,
    venueLong: 0,
    bandNames: bandNames.split(",").map((name: string) => name.trim()),
  };
}

async function hydrateLatLong(event: Event): Promise<Event> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const location = `${event.venueName}, ${event.venueLocation}`;
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    return Promise.reject(
      new Error(
        `No good matches for location "${location}". Is it a real place?`
      )
    );
  }

  const data = await response.json();
  if (data.results.length === 0) {
    return Promise.reject(
      new Error(
        `No good matches for location, "${location}". Is it a real place?`
      )
    );
  }

  const { lat, lng } = data.results[0].geometry.location;
  return Promise.resolve({
    ...event,
    venueLat: lat,
    venueLong: lng,
  });
}

async function createEvent(event: Event): Promise<boolean> {
  const result = await sql`
    INSERT INTO events (
        title,
        start_date,
        end_date,
        image_url,
        ticket_url,
        venue_name,
        venue_location,
        venue_url,
        venue_lat,
        venue_long,
        band_names
    ) VALUES (
        ${event.title},
        ${event.startDate.toISOString()},
        ${event.endDate.toISOString()},
        ${event.imageUrl},
        ${event.ticketUrl},
        ${event.venueName},
        ${event.venueLocation},
        ${event.venueUrl},
        ${event.venueLat},
        ${event.venueLong},
        ${event.bandNames.join(",")}
    )
  `;
  return result.rowCount === 1;
}
