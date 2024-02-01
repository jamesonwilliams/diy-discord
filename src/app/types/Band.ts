import { Location } from "./Location";

export interface Band {
  id: number;
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