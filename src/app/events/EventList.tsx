"use client";

import { Event } from "../types/Event";
import { useSearchParams } from "next/navigation";
import { LatLong } from "../types/LatLong";
import { EventSortKey } from "./EventSortKey";
import { compareDistances } from "../utils/distance";
import EventListOptions from "./EventListOptions";
import Link from "next/link";

export default function EventList({ events }: { events: Event[] }) {
  const searchParams = useSearchParams();
  const sortKey = parseSort(searchParams);
  const location = parseLocation(searchParams);
  const sortedEvents = sortEvents(events, sortKey, location);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <EventListOptions initialLocation={location} />
      <div className="flex-grow">
        {sortedEvents.map((event: Event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>
      <div>
        <p className="text-gray-500 py-4">
          Showing {sortedEvents.length} Events.
        </p>
      </div>
    </div>
  );
}

function sortEvents(
  events: Event[],
  sortKey: EventSortKey,
  location: LatLong | undefined
): Event[] {
  return [...events].sort((a: Event, b: Event) => {
    if (sortKey === EventSortKey.date) {
      return (
        new Date(b.startDate).getUTCMilliseconds() -
        new Date(a.startDate).getUTCMilliseconds()
      );
    } else if (location === undefined) {
      throw Error("Location must be provided for location sort");
    } else {
      const aLatLong = { lat: a.venueLat, long: a.venueLong };
      const bLatLong = { lat: b.venueLat, long: b.venueLong };
      return compareDistances(aLatLong, bLatLong, location);
    }
  });
}

function EventRow({ event }: { event: Event }) {
  const startDate = new Date(event.startDate);
  return (
    <div className="py-4 border-t border-gray-500">
      <p className="pt-2">
        <Link href={event.ticketUrl}>
          <strong>{event.title}</strong>
        </Link>{" "}
        - {startDate.toDateString()}, {startDate.toLocaleTimeString()}
      </p>
      <p className="pt-2">
        <Link href={event.venueUrl}>{event.venueName}</Link> -{" "}
        {event.venueLocation}
      </p>
      <p className="opacity-50 pt-2">{event.bandNames.join(", ")}</p>
    </div>
  );
}

function parseSort(searchParams: URLSearchParams): EventSortKey {
  const sort = searchParams.get("sort");
  if (sort === null) {
    return EventSortKey.date;
  } else if (sort === EventSortKey.location) {
    return EventSortKey.location;
  } else if (sort === EventSortKey.date) {
    return EventSortKey.date;
  } else {
    throw new Error("Invalid sort key");
  }
}

function parseLocation(searchParams: URLSearchParams): LatLong | undefined {
  const lat = searchParams.get("lat");
  const long = searchParams.get("long");
  if (lat === null || long === null) {
    return undefined;
  } else {
    return { lat: parseFloat(lat), long: parseFloat(long) };
  }
}
