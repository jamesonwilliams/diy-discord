import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { Event } from "@/app/types/Event";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const events = await getEvents();
    return NextResponse.json(
      { events: events, count: events.length },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

async function getEvents(): Promise<Event[]> {
  const result = await sql`SELECT * FROM events`;
  return result.rows.map((row: any) => {
    return {
      id: row.id,
      title: row.title,
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      imageUrl: new URL(row.image_url).toString(),
      ticketUrl: new URL(row.ticket_url).toString(),
      venueName: row.venue_name,
      venueLocation: row.venue_location,
      venueUrl: new URL(row.venue_url).toString(),
      bandNames: row.band_names,
      venueLat: parseFloat(row.venue_lat),
      venueLong: parseFloat(row.venue_long)
    };
  });
}
