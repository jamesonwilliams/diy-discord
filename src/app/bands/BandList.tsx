"use client";

import { Band } from "../types/Band";
import { useSearchParams } from "next/navigation";
import { LatLong } from "../types/LatLong";
import SocialsList from "./SocialsList";
import SortButton from "./SortButton";
import { SortKey } from "../types/SortKey";
import { compareNames } from "../utils/compareNames";
import { compareDistances } from "../utils/distance";

export default function BandList({ bands }: { bands: Band[] }) {
  const searchParams = useSearchParams();
  const sortKey = parseSort(searchParams);
  const location = parseLocation(searchParams);
  const sortedBands = sortBands(bands, sortKey, location);

  return (
    <>
      <SortButton sortKey={sortKey} initialLocation={location} />
      <div className="flex-grow">
        {sortedBands.map((band: Band) => (
          <BandRow key={band.name} band={band} />
        ))}
      </div>
    </>
  );
}

function sortBands(
  bands: Band[],
  sortKey: SortKey,
  location: LatLong | undefined
): Band[] {
  return bands.sort((a: Band, b: Band) => {
    if (sortKey === SortKey.bandName) {
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

function parseSort(searchParams: URLSearchParams): SortKey {
  const sort = searchParams.get("sort");
  if (sort === null) {
    return SortKey.bandName;
  } else if (sort === SortKey.location) {
    return SortKey.location;
  } else if (sort == SortKey.bandName) {
    return SortKey.bandName;
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
