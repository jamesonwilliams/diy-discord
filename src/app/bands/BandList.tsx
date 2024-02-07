"use client";

import { Band } from "../types/Band";
import { useSearchParams } from "next/navigation";
import { LatLong } from "../types/LatLong";
import SocialsList from "./SocialsList";
import BandListOptions from "./BandListOptions";
import { BandSortKey } from "./BandSortKey";
import { compareNames } from "../utils/compareNames";
import { compareDistances } from "../utils/distance";
import Link from "next/link";

export default function BandList({ bands }: { bands: Band[] }) {
  const searchParams = useSearchParams();
  const sortKey = parseSort(searchParams);
  const location = parseLocation(searchParams);
  const sortedBands = sortBands(bands, sortKey, location);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <BandListOptions sortKey={sortKey} initialLocation={location} />
      <div className="flex-grow">
        {sortedBands.map((band: Band) => (
          <BandRow key={band.name} band={band} />
        ))}
      </div>
      <div>
        <p className="text-gray-500 py-4">
          Showing {sortedBands.length} bands.
        </p>
      </div>
    </div>
  );
}

function sortBands(
  bands: Band[],
  sortKey: BandSortKey,
  location: LatLong | undefined
): Band[] {
  return [...bands].sort((a: Band, b: Band) => {
    if (sortKey === BandSortKey.bandName) {
      return compareNames(a.name, b.name);
    } else if (location === undefined) {
      throw Error("Location must be provided for location sort");
    } else {
      return compareDistances(a.homeBase.latLong, b.homeBase.latLong, location);
    }
  });
}

function BandRow({ band }: { band: Band }) {
  return (
    <div className="py-4 border-t border-gray-500">
      <strong>{band.name}</strong>
      <ul className="flex justify-between">
        <li className="">
          {band.homeBase.city}, {band.homeBase.state}
        </li>
        <li className="">
          <SocialsList socials={band.socials} />
        </li>
      </ul>
    </div>
  );
}

function parseSort(searchParams: URLSearchParams): BandSortKey {
  const sort = searchParams.get("sort");
  if (sort === null) {
    return BandSortKey.bandName;
  } else if (sort === BandSortKey.location) {
    return BandSortKey.location;
  } else if (sort === BandSortKey.bandName) {
    return BandSortKey.bandName;
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
