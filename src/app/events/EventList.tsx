
import { Event } from "../types/Event";
import Image from "next/image";
import Link from "next/link";

export default function EventList({ events }: { events: Event[] }) {
    return (
      <div className="flex flex-wrap justify-evenly">
        {events.map((event) => (
          <EventRow key={event.title} event={event} />
        ))}
      </div>
    );
}

function EventRow({ event }: { event: Event }) {
    const imagePath = `/${event.image}`;

    return (
      <div className="p-4 text-center mb-auto">
        <Link href={event.ticketUrl} target="_blank">
          <Image src={imagePath} alt={event.title} width={300} height={300} />
        </Link>
        <Metadata event={event} />
      </div>
    );
}

function Metadata({ event }: { event: Event }) {
    let dateText: string = `${event.startDate}`
    if (event.startDate !== event.endDate) {
      dateText = `${event.startDate} - ${event.endDate}`;
    }
    return (
      <div className="p-2">
        <strong><Link href={event.ticketUrl}>{event.title}</Link></strong> - {event.venue.location}
        <p><Link href={event.venue.url}>{event.venue.name}</Link></p>
        <p>{dateText}</p>
      </div>
    );
}
