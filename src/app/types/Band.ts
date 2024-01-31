import { LatLong } from "./LatLong";

export interface Band {
  name: string;
  homeBase: HomeBase;
  socials: Socials;
}

export interface HomeBase {
  city: string;
  state: string;
  country: string;
  latLong: LatLong;
}

export interface Socials {
  spotify: string;
  bandcamp: string;
  instagram: string;
  twitter: string;
}