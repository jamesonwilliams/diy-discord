import fs from "fs";
import path from "path";
import EventList from "./EventList";

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
  return JSON.parse(eventData).sort((a: Event, b: Event) => {
    return a.startDate > b.startDate ? 1 : -1;
  });
}
