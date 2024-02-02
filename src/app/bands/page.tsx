"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Band } from "../types/Band";
import LoadingSpinner from "../components/spinner/LoadingSpinner";

const MapWithMarkersLazy = React.lazy(
  () => import("../components/map/MapWithMarkers")
);
const BandListLazy = React.lazy(() => import("./BandList"));

export default function BandsPage() {
  const [bands, setBands] = useState<Band[]>([]);
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
        const response = await fetch(`/api/bands`);
        if (!response.ok) {
          throw new Error("Failed to fetch bands");
        }
        setBands((await response.json()).bands);
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
          coordinates={bands.map((band: Band) => ({
            lat: band.homeBase.latLong.lat,
            lng: band.homeBase.latLong.long,
            label: band.name,
          }))}
          mapsApiKey={process.env.GOOGLE_MAPS_API_KEY!!}
        />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <BandListLazy bands={bands} />
      </Suspense>
    </div>
  );
}
