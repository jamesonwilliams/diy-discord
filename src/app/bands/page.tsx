import React, { Suspense } from "react";
import { Band } from "../types/Band";
import BandList from "./BandList";
import MapWithMarkers from "../components/map/MapWithMarkers";
import getBands from "../utils/getBands";

export default async function Page() {
  const bands: Band[] = await getBands()
  const coordinates = bands.map((band: Band) => {
    return {
      lat: band.homeBase.latLong.lat,
      lng: band.homeBase.latLong.long,
      label: band.name,
    };
  });

  return (
    <div className="min-w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <MapWithMarkers
          coordinates={coordinates}
          mapsApiKey={process.env.GOOGLE_MAPS_API_KEY!!}
        />
        <BandList bands={bands} />
      </Suspense>
    </div>
  );
};
