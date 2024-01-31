import { Band } from "../types/Band";
import { LatLong } from "../types/LatLong";

export function getDistanceFromLatLonInKm(first: LatLong, second: LatLong) {
  const lat1 = first.lat, lon1 = first.long;
  const lat2 = second.lat, lon2 = second.long;
  
  const earthRadiusKm = 6371; // Radius of the earth in kilometers
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c; // Distance in km
  return distance;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function compareDistances(aLocation: LatLong, bLocation: LatLong, location: LatLong): number {
  const distanceA = getDistanceFromLatLonInKm(aLocation, location);
  const distanceB = getDistanceFromLatLonInKm(bLocation, location);
  return distanceA - distanceB;
}