import { ActionLink, PageHero } from "../components/PageParts";
import { media } from "../data/media";

export default function Events() {
  return <main className="events-page"><PageHero eyebrow="UPCOMING EVENTS" title="What's Next." image={media.eventsHero} imageAlt="Young athletes at an ItaBEES academy event" description="Explore upcoming ItaBEES camps, clinics and academy events." /><section className="page-empty-state"><p>No events at the moment</p><ActionLink to="/contact" black>Ask about upcoming opportunities</ActionLink></section></main>;
}
