import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { BandSortKey } from "./BandSortKey";
import { LatLong } from "../types/LatLong";
import { useEffect, useState } from "react";

export default function BandListOptions({ 
  sortKey,
  initialLocation
}: { 
  sortKey: BandSortKey,
  initialLocation: LatLong | undefined 
}) {
  const router = useRouter();
  const [location, setLocation] = useState<LatLong | undefined>(initialLocation);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      (error) => {
        setLocation(undefined)
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
      }
    );
  },[initialLocation]);

  return (
    <>
      <ul className="flex gap-4 justify-between font-bold">
        <li>
          <button
            className="pb-8"
            onClick={() => navigate(BandSortKey.bandName, undefined, router)}
          >
            Sort by name
          </button>
        </li>
        {location !== undefined && <li>
          <button
            className="pb-8"
            onClick={() => navigate(BandSortKey.location, location, router)}
          >
            Sort by closest to you
          </button>
        </li> || <p className="opacity-50">Getting your location...</p>}
        <li>
          <button
            className="pb-8"
            onClick={() => router.push("/bands/add")}
          >
            Add a band
          </button>
        </li>
      </ul>
    </>
  );
}

function navigate(
  sortKey: BandSortKey,
  location: LatLong | undefined,
  router: AppRouterInstance
) {
  if (sortKey === BandSortKey.location && location !== undefined) {
    router.push(
      `?sort=${BandSortKey.location}&lat=${location.lat}&long=${location.long}`
    );
  } else {
    router.push(`?sort=${BandSortKey.bandName}`);
  }
}
