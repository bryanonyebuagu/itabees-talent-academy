import { PageHero } from "../components/PageParts";
import LaunchClinic from "../components/LaunchClinic";
import { media } from "../data/media";

export default function Events() {
  return <main className="events-page"><PageHero eyebrow="UPCOMING EVENTS" title={<>What's <span className="editorial-accent">Next.</span></>} image={media.eventsHero} imageAlt="Young athletes at an ItaBEES academy event" description="Explore upcoming ItaBEES camps, clinics and academy events." /><LaunchClinic /></main>;
}
