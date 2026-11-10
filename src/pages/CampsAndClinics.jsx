import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

export default function CampsAndClinics() {
  return <main><PageHero eyebrow="CAMPS & CLINICS" title="More touches. More challenges. More growth." image={media.campDesktop} mobileImage={media.campMobile} imageAlt="ItaBEES youth soccer camp with players and coaches" description="ItaBEES camps and clinics give players additional opportunities to train, compete and learn outside their regular team environment." />
    <ContentSection eyebrow="TRAIN WITH PURPOSE" title="Built around the player." image={media.coaching} imageAlt="Coach mentoring a group of players"><p>From school-break and summer camps to position-specific clinics and special guest coaching events, each experience is designed with a clear developmental purpose.</p><p>Players leave with more than memories, taking with them new skills, greater confidence and a better understanding of the game.</p><ActionLink to="/events" black>View upcoming camps & clinics</ActionLink></ContentSection></main>;
}
