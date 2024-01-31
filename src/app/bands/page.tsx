import React, { Suspense } from "react";
import { Band } from "../types/Band";
import fs from "fs";
import path from 'path';
import BandList from "./BandList";
import MapWithMarkers from "../components/map/MapWithMarkers";

export default async function Page() {
  const bands = getBands();
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

function getBands(): Band[] {
  const jsonPath = path.join(process.cwd(), "data", "bands.json");
  const bandsData = fs.readFileSync(jsonPath, "utf8");
  return JSON.parse(bandsData).sort((a: Band, b: Band) => {
    return a.name.localeCompare(b.name);
  });
}
