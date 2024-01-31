import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SortKey } from "../types/SortKey";
import { LatLong } from "../types/LatLong";
import { useEffect, useState } from "react";

export default function SortButton({ 
  sortKey,
  initialLocation
}: { 
  sortKey: SortKey,
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
      <ul className="flex gap-8">
        <li>
          <button
            className="pb-8"
            onClick={() => navigate(SortKey.bandName, undefined, router)}
          >
            Sort by name
          </button>
        </li>
        {location !== undefined && <li>
          <button
            className="pb-8"
            onClick={() => navigate(SortKey.location, location, router)}
          >
            Sort by closest to you
          </button>
        </li> || <p className="opacity-50">Getting your location...</p>}
      </ul>
    </>
  );
}

function navigate(
  sortKey: SortKey,
  location: LatLong | undefined,
  router: AppRouterInstance
) {
  if (sortKey === SortKey.location && location !== undefined) {
    router.push(
      `?sort=${SortKey.location}&lat=${location.lat}&long=${location.long}`
    );
  } else {
    router.push(`?sort=${SortKey.bandName}`);
  }
}
