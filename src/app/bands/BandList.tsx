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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="text-left">
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedBands.map((band: Band) => (
            <BandRow key={band.name} band={band} />
          ))}
        </tbody>
      </table>
    </>
  );
}

function sortBands(bands: Band[], sortKey: SortKey, location: LatLong | undefined): Band[] {
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
    <tr>
      <td className="pr-8">{band.name}</td>
      <td className="pr-8">
        {band.homeBase.city}, {band.homeBase.state}
      </td>
      <td className="pr-8 text-gray-500">
        <SocialsList socials={band.socials} />
      </td>
    </tr>
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
