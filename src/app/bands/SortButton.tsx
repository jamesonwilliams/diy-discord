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

  const buttonText =
    sortKey === SortKey.bandName && location !== undefined ? "Sort by distance" : "Sort by name";
    
  return (
    <button
      className="pb-8"
      onClick={() => navigate(sortKey, location, router)}
    >
      {buttonText}
    </button>
  );
}

function navigate(
  sortKey: SortKey,
  location: LatLong | undefined,
  router: AppRouterInstance
) {
  if (sortKey === SortKey.bandName && location !== undefined) {
    router.push(
      `?sort=${SortKey.location}&lat=${location.lat}&long=${location.long}`
    );
  } else {
    router.push(`?sort=${SortKey.bandName}`);
  }
}
