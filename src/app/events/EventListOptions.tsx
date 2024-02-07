import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { LatLong } from "../types/LatLong";
import { useEffect, useState } from "react";
import { EventSortKey } from "./EventSortKey";

export default function EventListOptions({
  initialLocation,
}: {
  initialLocation: LatLong | undefined;
}) {
  const router = useRouter();
  const [location, setLocation] = useState<LatLong | undefined>(
    initialLocation
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      (error) => {
        setLocation(undefined);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
      }
    );
  }, [initialLocation]);

  return (
    <>
      <ul className="flex gap-4 justify-between font-bold">
        <li>
          <button
            className="pb-8"
            onClick={() => navigate(EventSortKey.date, undefined, router)}
          >
            Sort by date
          </button>
        </li>
        {(location !== undefined && (
          <li>
            <button
              className="pb-8"
              onClick={() => navigate(EventSortKey.location, location, router)}
            >
              Sort by closest
            </button>
          </li>
        )) || <p className="opacity-50">Getting your location...</p>}
        <li>
          <button className="pb-8" onClick={() => router.push("/events/add")}>
            Add an event
          </button>
        </li>
      </ul>
    </>
  );
}

function navigate(
  sortKey: EventSortKey,
  location: LatLong | undefined,
  router: AppRouterInstance
) {
  if (sortKey === EventSortKey.location && location !== undefined) {
    router.push(
      `?sort=${EventSortKey.location}&lat=${location.lat}&long=${location.long}`
    );
  } else {
    router.push(`?sort=${EventSortKey.date}`);
  }
}
