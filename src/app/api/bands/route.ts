
import { Band } from "@/app/types/Band";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const bands = await getBands();
    return NextResponse.json({ bands: bands, count: bands.length }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

async function getBands(): Promise<Band[]> {
  const result = await sql`SELECT * FROM bands`;
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
