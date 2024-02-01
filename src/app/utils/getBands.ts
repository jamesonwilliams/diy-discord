import { Band } from "../types/Band";
import { sql } from "@vercel/postgres";

export default async function getBands(): Promise<Band[]> {
  const result = await sql`SELECT * FROM bands`;
  // Map the database result to your Band interface
  return result.rows.map((row: any) => {
    return {
      id: row.id,
      name: row.name,
      homeBase: {
        city: row.city,
        state: row.state,
        country: row.country,
        latLong: {
          lat: parseFloat(row.lat),
          long: parseFloat(row.long),
        },
      },
      socials: {
        spotify: row.spotify,
        bandcamp: row.bandcamp,
        instagram: row.instagram,
        twitter: row.twitter,
      },
    };
  });
}
