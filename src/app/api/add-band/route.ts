// Import necessary dependencies
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// Define the POST method to add a band
export async function POST(request: Request) {
  try {
    // Parse the request body as JSON
    const requestBody = await request.json();

    // Extract band details from the request body
    const {
      name,
      city,
      state,
      country,
      lat,
      long,
      spotify,
      bandcamp,
      instagram,
      twitter,
    } = requestBody;

    // Insert the band details into the database
    const result = await sql`
      INSERT INTO bands (name, city, state, country, lat, long, spotify, bandcamp, instagram, twitter)
      VALUES (${name}, ${city}, ${state}, ${country}, ${lat}, ${long}, ${spotify}, ${bandcamp}, ${instagram}, ${twitter})
      RETURNING *;`;

    // Return the newly added band as JSON response
    return NextResponse.json({ band: result.rows[0] }, { status: 201 });
  } catch (error) {
    // Return error response if an error occurs
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
