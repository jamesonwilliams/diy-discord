import { LatLong } from "./LatLong";

export interface Band {
  name: string;
  homeBase: Location;
  socials: Socials;
}

export interface Socials {
  spotify: string;
  bandcamp: string;
  instagram: string;
  twitter: string;
}