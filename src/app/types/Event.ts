import { Venue } from "./Venue";

export interface Event {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  imageUrl: string;
  ticketUrl: string;
  venueName: string;
  venueLocation: string;
  venueUrl: string;
  venueLat: number;
  venueLong: number;
  bandNames: string[];
};

