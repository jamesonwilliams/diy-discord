"use client";

import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api";
import { getDistanceFromLatLonInKm } from "../../utils/distance";
import { LatLong } from "@/app/types/LatLong";
import ReactDOM from "react-dom";

interface Coordinate {
  lat: number;
  lng: number;
  label: string;
}

interface MapWithMarkersProps {
  coordinates: Coordinate[];
  mapsApiKey: string;
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ coordinates, mapsApiKey }) => {
  const mapContainerStyle: React.CSSProperties = {
    width: "100%",
    height: "400px",
  };

  const defaultCenter = {
    lat: 38.627003,
    lng: -95.199402,
    label: "",
  };
  
  const [selectedMarker, setSelectedMarker] = useState<Coordinate | null>(
    null
  );
  const [center, setCenter] = useState<Coordinate>({
    lat: defaultCenter.lat,
    lng: defaultCenter.lng,
    label: defaultCenter.label
  });
    
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: mapsApiKey,
    libraries: ["places"]
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const handleMarkerClick = (coord: Coordinate) => {
    setSelectedMarker(coord);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  const clusteredCoordindates = groupCoordinates(coordinates, 25);

  const handleLoad = (map: google.maps.Map) => {
    if (!isLoaded) return;
    const centerMeButton = <CenterMeButton map={map} />;
    const centerControlDiv = document.createElement("div");
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(centerMeButton, centerControlDiv);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={3.5}
      onLoad={handleLoad}
      onClick={() => setSelectedMarker(null)}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: true,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }}
    >
      <>
        {clusteredCoordindates.map((coord, index) => (
          <Marker
            key={index}
            position={{ lat: coord.lat, lng: coord.lng }}
            title={coord.label}
            onClick={() => handleMarkerClick(coord)}
          />
        ))}
        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.lat,
              lng: selectedMarker.lng,
            }}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="text-black">{selectedMarker.label}</div>
          </InfoWindow>
        )}
      </>
    </GoogleMap>
  );
};

interface CenterMeButtonProps {
  map: google.maps.Map;
}

const CenterMeButton: React.FC<CenterMeButtonProps> = ({ map }) => {
  const handleCenterMeClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.panTo({ lat: latitude, lng: longitude });
    });
  };

  return (
    <button
      style={{
        position: "absolute",
        top: "260px",
        right: "10px",
        zIndex: 1,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "2px",
        padding: "6px",
      }}
      onClick={handleCenterMeClick}
    >
      Center
    </button>
  );
};

// Function to group nearby coordinates into clusters
function groupCoordinates(coordinates: Coordinate[], maxDistance: number): Coordinate[] {
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
      const distance = getDistanceFromLatLonInKm(coordinateLatLng, clusterLatLong);

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

export default MapWithMarkers;
