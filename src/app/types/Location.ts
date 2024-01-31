import { LatLong } from './LatLong';

export interface Location {
  city: string;
  state: string;
  country: string;
  latLong: LatLong;
}
