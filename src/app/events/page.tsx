"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Event } from "../types/Event";
import LoadingSpinner from "../components/spinner/LoadingSpinner";

const MapWithMarkersLazy = React.lazy(
  () => import("../components/map/MapWithMarkers")
);
const EventListLazy = React.lazy(() => import("./EventList"));

export const dynamic = "force-dynamic";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (process.env.GOOGLE_MAPS_API_KEY === undefined) {
      setError(new Error("No maps key"));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/events`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        setEvents((await response.json()).events);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-w-full">
      <Suspense fallback={<LoadingSpinner />}>
        <MapWithMarkersLazy
          coordinates={events.map((event: Event) => ({
            lat: event.venueLat,
            lng: event.venueLong,
            label: event.title,
          }))}
          mapsApiKey={process.env.GOOGLE_MAPS_API_KEY!!}
        />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <EventListLazy events={events} />
      </Suspense>
    </div>
  );
}
