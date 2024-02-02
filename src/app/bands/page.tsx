import React, { Suspense } from "react";
import { Band } from "../types/Band";
import BandList from "./BandList";
import getBands from "../utils/getBands";
import { unstable_noStore as noStore } from "next/cache";


const MapWithMarkersLazy = React.lazy(() => import("../components/map/MapWithMarkers"));

export default async function Page() {
  noStore();
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
        <MapWithMarkersLazy
          coordinates={coordinates}
          mapsApiKey={process.env.GOOGLE_MAPS_API_KEY!!}
        />
        <BandList bands={bands} />
      </Suspense>
    </div>
  );
};
