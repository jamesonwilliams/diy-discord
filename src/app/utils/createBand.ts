import { Band } from "../types/Band";
import { sql } from "@vercel/postgres";

export default async function createBand(band: Band): Promise<boolean> {
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
