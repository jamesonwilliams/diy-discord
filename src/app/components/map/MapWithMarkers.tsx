"use client";

import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import { LatLong } from "@/app/types/LatLong";
import { getDistanceFromLatLonInKm } from "@/app/utils/distance";

interface Coordinate {
  lat: number;
  lng: number;
  label: string;
}

export default function MapWithMarkers({
  mapsApiKey,
  coordinates,
}: {
  mapsApiKey: string;
  coordinates: Coordinate[];
}) {
  const [selectedMarker, setSelectedMarker] = useState<Coordinate | undefined>(
    undefined
  );
  const [zoomLevel, setZoomLevel] = useState(3);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const zoom = 2.8 + (screenWidth - 300) * 0.0015;
    setZoomLevel(zoom);
  }, []);

  const markers = groupCoordinates(coordinates, 50).map((coordinate) => {
    return (
      <Marker
        key={coordinate.label}
        position={{ lat: coordinate.lat, lng: coordinate.lng }}
        onClick={() => {
          setSelectedMarker(coordinate);
        }}
      />
    );
  });

  const infoWindow = selectedMarker ? (
    <InfoWindow
      position={{
        lat: selectedMarker.lat,
        lng: selectedMarker.lng,
      }}
      onCloseClick={() => setSelectedMarker(undefined)}
      disableAutoPan={true}
    >
      <div className="text-black">{selectedMarker.label}</div>
    </InfoWindow>
  ) : (
    <></>
  );

  return (
    <div className="h-96 w-full" tabIndex={-1}>
      <APIProvider apiKey={mapsApiKey}>
        <Map
          center={{
            lat: 38.627003,
            lng: -98.199402,
          }}
          zoom={zoomLevel}
          gestureHandling={"greedy"}
          streetViewControl={false}
          mapTypeControl={false}
          onClick={() => setSelectedMarker(undefined)}
        >
          {markers}
          {infoWindow}
        </Map>
      </APIProvider>
    </div>
  );
}

// Function to group nearby coordinates into clusters
function groupCoordinates(
  coordinates: Coordinate[],
  maxDistance: number
): Coordinate[] {
  const clusters: Coordinate[] = [];

  for (let i = 0; i < coordinates.length; i++) {
    let grouped = false;

    for (let j = 0; j < clusters.length; j++) {
      const coordinateLatLng: LatLong = {
        lat: coordinates[i].lat,
        long: coordinates[i].lng,
      };
      const clusterLatLong: LatLong = {
        lat: clusters[j].lat,
        long: clusters[j].lng,
      };
      const distance = getDistanceFromLatLonInKm(
        coordinateLatLng,
        clusterLatLong
      );

      if (distance <= maxDistance) {
        // Add the coordinate to an existing cluster
        clusters[j].label += `, ${coordinates[i].label}`;
        grouped = true;
        break;
      }
    }

    if (!grouped) {
      // Create a new cluster with the current coordinate
      clusters.push({ ...coordinates[i] });
    }
  }

  return clusters;
}
