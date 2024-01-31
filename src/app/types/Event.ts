import { Venue } from "./Venue";

export interface Event {
    title: string;
    venue: Venue;
    image: string;
    startDate: Date;
    endDate: Date;
    ticketUrl: string;
};

