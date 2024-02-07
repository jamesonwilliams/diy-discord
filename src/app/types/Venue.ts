import { LatLong } from "./LatLong";

export interface Venue {
    name: string;
    url: string;
    location: string;
    latLong: LatLong;
}
