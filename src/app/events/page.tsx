import fs from "fs";
import path from "path";
import EventList from "./EventList";
import { Event } from "../types/Event";

export default async function Page() {
  return (
    <div>
      <EventList events={getEvents()} />
    </div>
  );
}

function getEvents(): Event[] {
  const jsonPath = path.join(process.cwd(), "data", "events.json");
  const eventData = fs.readFileSync(jsonPath, "utf8");
  const eventJson: Event[] = JSON.parse(eventData)
  return eventJson.sort((a: Event, b: Event) => {
    return a.startDate > b.startDate ? 1 : -1;
  });
}
