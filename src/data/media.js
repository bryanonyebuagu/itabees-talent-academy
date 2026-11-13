const assets = import.meta.glob("../assets/*", { eager: true, query: "?url", import: "default" });
const find = (term) => Object.entries(assets).find(([path]) => path.toLowerCase().includes(term.toLowerCase()))?.[1] || "";

export const media = {
  logo: find("logo.jpeg"),
  hero: find("Boy_running_with_football_adf"),
  training: find("Boy_running_with_football_training"),
  eligibilityDesktop: find("eligibility-team-desktop.jpg"),
  eligibilityMobile: find("eligibility-team-mobile.jpg"),
  coaching: find("58ff75a0"),
  coachingMobile: find("fb924b01"),
  coachMarcus: find("MARCUS_thorne.jpg"),
  coachElena: find("Elena Rodriguez.jpg"),
  coachDavid: find("David Chen.jpg"),
  assessmentDesktop: find("Football_on_empty_pitch_at_690bf627_2K"),
  assessmentMobile: find("Football_on_empty_pitch_30290df4_2K"),
  team: find("Enhance_photograph"),
  aboutStory: find("3_4_ratio_d5a36cc3_2K"),
  aboutWhy: find("Enhance_photograph_quality_75c10340_2K"),
  internationalHome: find("Enhancing_professional_photograp"),
  education: find("ai-generated-IMAGE"),
  camp: find("itabees-camp-clinic"),
  campDesktop: find("training_camp for desktop_8e35f8d2_2K"),
  campMobile: find("training_camp for mobile_86235acd_2K"),
  eventsHero: find("Enhancing_phone_photograph_quality_bcda055d_2K"),
  programs: find("itabees-programs-training"),
  pathway: find("itabees-player-pathway"),
  donation: find("22e53e"),
};
