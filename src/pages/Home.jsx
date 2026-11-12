import { useEffect, useRef, useState } from "react";
import ArrowUpRight from "../components/ArrowUpRight";
import { media } from "../data/media";
import { coachingTeam } from "../data/coachingTeam";
import CoachPraise from "../components/CoachPraise";
import "../App.css";

const assets = import.meta.glob("../assets/*", {
  eager: true,
  query: "?url",
  import: "default",
});

function findImage(searchTerm, fallback = "") {
  const match = Object.entries(assets).find(([path]) =>
    path.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return match?.[1] || fallback;
}

const images = {
  logo: findImage("logo.jpeg"),
  hero: findImage("Boy_running_with_football_adf") || findImage("hero.png"),
  action: findImage("Boy_running_with_football_training"),
  approachGif: findImage("itabees-approach-dribble"),
  coaching: findImage("58ff75a0"),
  introCoaching: findImage("fb924b01"),
  eyong: findImage("Eyong Enoh"),
  academy: findImage("ai-generated-IMAGE"),
  extra: findImage("itabees-camp-clinic"),
  team: findImage("Enhance_photograph"),
  donate: findImage("22e53e"),
};

const developmentAreas = [
  {
    number: "01",
    title: "Technical Development",
    description:
      "Build confidence on the ball through focused training in passing, dribbling, ball control and finishing.",
    icon: "⚽",
  },
  {
    number: "02",
    title: "Tactical Understanding",
    description:
      "Develop game intelligence, decision-making and a better understanding of how to play as part of a team.",
    icon: "♟",
  },
  {
    number: "03",
    title: "Mental Strength",
    description:
      "Build discipline, resilience, confidence and the mindset needed to keep improving.",
    icon: "✦",
  },
  {
    number: "04",
    title: "Personal Growth",
    description:
      "Encourage leadership, respect, teamwork and the personal qualities that matter beyond football.",
    icon: <ArrowUpRight />,
  },
];

const pillars = [
  ["CHARACTER", "We develop integrity, discipline, resilience, respect, responsibility and leadership, qualities that matter long after the final whistle."],
  ["EXCELLENCE", "Excellence isn't perfection. It is the commitment to continually learn, improve and give your best in training, competition, school and life."],
  ["EDUCATION", "We encourage our players to value academic achievement alongside athletic development. Soccer can create opportunities, but education helps prepare players to make the most of them."],
  ["SOCCER", "We develop intelligent, confident and technically capable players through purposeful training, game understanding and a lifelong love for the sport."],
];

const livePathway = [
  ["LOCAL DEVELOPMENT", "Build the technical foundation, confidence and habits required for long-term growth."],
  ["COMPETITIVE DEVELOPMENT", "Prepare for increasingly challenging environments through advanced training, player assessments and higher-level developmental opportunities."],
  ["COLLEGE EXPOSURE", "Help aspiring student-athletes better understand the college soccer pathway through education, preparation, exposure opportunities and connections."],
  ["INTERNATIONAL EXPERIENCES", "Provide selected players with opportunities to experience different soccer cultures through camps, training experiences, scouting events and international partnerships."],
  ["PROFESSIONAL OPPORTUNITIES", "For players who demonstrate the ability, commitment and readiness, ItaBEES seeks to create access to credible environments where they can be evaluated and continue pursuing higher levels of the game."],
];

const bookUrl = "/programs";
const contactUrl = "/contact";

export default function Home() {
  const developmentSectionRef = useRef(null);
  const [developmentVisible, setDevelopmentVisible] = useState(false);
  const [activeDevelopmentIndex, setActiveDevelopmentIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = (event) => setReducedMotion(event.matches);
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const section = developmentSectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setDevelopmentVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!developmentVisible || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveDevelopmentIndex((index) => (index + 1) % developmentAreas.length);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [developmentVisible, reducedMotion]);

  useEffect(() => {
    if (!window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 150);
    return () => window.clearTimeout(timer);
  }, []);



  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <>


      <main>
        <section className="hero-section" id="home">
          <div
            className="hero-image"
            style={{
              backgroundImage: images.hero ? `url("${images.hero}")` : "none",
            }}
          />
          <div className="hero-shade" />

          <div className="hero-content">
            <p className="eyebrow hero-eyebrow">
              <span /> WELCOME TO ITABEES TALENT ACADEMY
            </p>

            <h1>
              SUPPLEMENTAL
              <br />
              SOCCER TRAINING
            </h1>

            <p className="hero-tagline">Developing Players. Building Character. Inspiring Excellence.</p>
            <p className="hero-lead">More than Soccer Training. A Pathway to Greater Opportunities.</p>

            <p className="hero-description">
              Specialized training, professional mentorship, and pathways to college and professional soccer opportunities for players U8–U19.
            </p>

            <div className="hero-actions">
              <a className="button button-yellow" href="/programs">
                Explore our academy <span><ArrowUpRight /></span>
              </a>
              <a className="text-link light-link" href="/about">
                Discover ItaBEES <span>→</span>
              </a>
            </div>
          </div>

          <div className="hero-bottom">
            <span>SUPPLEMENTAL SOCCER DEVELOPMENT</span>
            <span className="hero-scroll">
              SCROLL TO EXPLORE <span>↓</span>
            </span>
          </div>

        </section>

        <section className="reference-intro reveal" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.58), rgba(0,0,0,.43)), url("${images.introCoaching}")` }}>
          <p className="eyebrow">MORE THAN TRAINING.</p>
          <h2>A PATHWAY FOR <span>EVERY PLAYER.</span></h2>
          <p>At ItaBEES Talent Academy, we believe every player deserves the opportunity to grow, compete and discover how far the game can take them.</p>
          <p>Our supplemental soccer development programs are designed to work alongside your player’s current club, recreational, school or academy team. Through intentional training, mentorship and meaningful opportunities, we help players develop the technical ability, confidence, game intelligence and character needed for their next level.</p>
          <div className="section-actions"><a className="button button-yellow" href={bookUrl}>FIND YOUR PROGRAM <span><ArrowUpRight /></span></a><a className="text-link dark-link" href={bookUrl}>REGISTER FOR TRAINING <span><ArrowUpRight /></span></a></div>
        </section>

        <section className="intro-section reveal" id="about">
          <div className="intro-grid">
            <div className="intro-heading">
              <p className="eyebrow">THE ITABEES PHILOSOPHY</p>
              <h2>
                Every player has
                <br />
                <span>potential.</span>
                <br />
                Let's build it.
              </h2>
            </div>

            <div className="intro-copy">
              <p className="intro-lead">
                We believe talented and motivated young players deserve access
                to quality development, strong mentorship and opportunities to
                see what is possible.
              </p>
              <p>
                ItaBEES Talent Academy was created around that simple belief. We
                provide supplemental soccer development while helping players
                build the technical, tactical, mental and personal qualities
                needed to pursue their individual goals.
              </p>
              <p>
                Our vision extends beyond producing better soccer players. We
                want to develop confident young people prepared to succeed
                wherever their journey takes them.
              </p>
              <a className="text-link dark-link" href="/player-pathway">
                Discover our approach <span>→</span>
              </a>
            </div>
          </div>

          <div className="values-strip">
            {["Character", "Excellence", "Education", "Soccer"].map(
              (value, index) => (
                <div className="value-float" key={value}>
                  <div className="value-item">
                    <span>0{index + 1}</span>
                    <strong>{value}</strong>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="development-section reveal" id="development" ref={developmentSectionRef}>
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">GROW WITH PURPOSE</p>
              <h2>
                More than
                <br />
                <span>the game.</span>
              </h2>
            </div>
            <p className="section-side-copy">
              The best development happens when we look at the whole player. Our
              approach combines football training with the qualities that help
              young people thrive.
            </p>
          </div>

          <div className="development-grid">
            {developmentAreas.map((item, index) => (
              <article
                className={`development-card${developmentVisible && !reducedMotion && activeDevelopmentIndex === index ? " is-active" : ""}`}
                key={item.number}
              >
                <div className="development-card-top">
                  <span>{item.number}</span>
                  <span className="development-icon">{item.icon}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="card-arrow"><ArrowUpRight /></span>
              </article>
            ))}
          </div>

          <div className="development-image-wrap">
            {images.approachGif && <picture><source media="(prefers-reduced-motion: reduce)" srcSet={images.action} /><img src={images.approachGif} alt="Young ItaBEES player advancing with the ball on the pitch" loading="lazy" /></picture>}
            <div className="image-caption">
              <span>THE ITABEES APPROACH</span>
              <strong>Progress is built, one session at a time.</strong>
            </div>
          </div>
        </section>

        <section className="camps-section reveal" id="camps">
          <div className="editorial-photo"><picture><source media="(max-width: 700px)" srcSet={media.campMobile} /><img src={media.campDesktop} alt="ItaBEES players training with coaches at camp" /></picture><span className="camps-photo-label">CAMPS &amp; CLINICS</span></div>
          <div className="editorial-copy"><p className="eyebrow">CAMPS &amp; CLINICS</p><h2>MORE TOUCHES.<br /><span>MORE GROWTH.</span></h2><p>ItaBEES camps and clinics give players additional opportunities to train, compete and learn outside their regular team environment.</p><p>From school-break and summer camps to position-specific clinics and special guest coaching events, each experience is designed with a clear developmental purpose.</p><p>Players leave with more than memories, taking with them new skills, greater confidence and a better understanding of the game.</p><a className="text-link dark-link" href={bookUrl}>View Upcoming Camps &amp; Clinics <span><ArrowUpRight /></span></a></div>
        </section>

        <section className="pillars-section reveal" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.37), rgba(0,0,0,.48)), url("${images.extra}")` }}>
          <div className="section-heading-row"><div><p className="eyebrow">THE ITABEES WAY</p><h2>Developing Better Players<br /><span>and Better People.</span></h2></div><p>Soccer is the vehicle. Developing young people is the purpose. The ItaBEES Way is built around four pillars that guide everything we do:</p></div>
          <div className="pillar-grid">{pillars.map(([title, copy]) => <article className="pillar-card" key={title}><h3>{title}</h3><p>{copy}</p><a className="text-link dark-link" href="/mentorship">LEARN MORE <span><ArrowUpRight /></span></a></article>)}</div>
        </section>

        <section className="pathway-section reveal" id="pathway">
          <div className="pathway-intro">
            <p className="eyebrow">EVERY JOURNEY IS DIFFERENT</p>
            <h2>
              A pathway built
              <br />
              <span>around you.</span>
            </h2>
            <p>
              There is no single route to success. We help players understand
              where they are, work towards where they want to be and make
              progress along the way.
            </p>
          </div>

          <div className="pathway-list">
            {livePathway.map(([title, copy], index) => (
              <article className="pathway-step" key={title}>
                <span className="pathway-number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="pathway-arrow"><ArrowUpRight /></span>
              </article>
            ))}
          </div>
        </section>

        <section className="why-section reveal" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.58), rgba(0,0,0,.35)), url("${images.hero}")` }}>
          <div className="editorial-copy"><p className="eyebrow">WHY ITABEES?</p><h2>Your Team Develops the Team.<br /><span>We Help Develop the Individual.</span></h2><p>ItaBEES is designed to complement, not replace, a player's existing soccer environment.</p><p>Players from recreational leagues, competitive clubs, school teams and other academies are welcome.</p><p>Our supplemental model allows us to focus on something team environments don't always have enough time to provide: the individual player.</p><p>More touches. More feedback. More repetition. More confidence.</p><p>And most importantly, a development plan centered around the player rather than the roster.</p><strong>Club-Neutral · Player-Centered · Development-Focused</strong></div>
        </section>

        <section className="assessments-section reveal" style={{ "--assessment-desktop": `url("${media.assessmentDesktop}")`, "--assessment-mobile": `url("${media.assessmentMobile}")` }}><div><p className="eyebrow">PLAYER ASSESSMENTS</p><h2>Know Where You Are.<br /><span>Understand What's Next.</span></h2></div><div><p>Development becomes more meaningful when players understand what they're working toward.</p><p>ItaBEES Player Assessments help identify strengths, developmental priorities and areas of opportunity.</p><p>Our goal isn't simply to tell a player how they're performing. It's to give players and families a clearer picture of what to work on next.</p><strong>Assess. Develop. Reassess. Progress.</strong><div className="section-actions"><a className="button button-yellow" href={bookUrl}>Find Your Program <span><ArrowUpRight /></span></a><a className="text-link light-link" href={contactUrl}>Register Today <span><ArrowUpRight /></span></a></div></div></section>

        <section className="impact-section reveal" id="impact"><p className="eyebrow">COMMUNITY IMPACT</p><div className="stats-grid">{[["1,200+", "Players Reached"], ["1,500+", "Training Hours"], ["150+", "Community Clinics"], ["25+", "Scholarships"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

        <section className="mentorship-section reveal" id="coaches">
          <div className="mentorship-image">
            <div className="mentorship-intro">
              <p className="eyebrow">GUIDANCE THAT MAKES A DIFFERENCE</p>
              <h2>
                Great players
                <br />
                need great
                <br />
                <span>people around them.</span>
              </h2>
            </div>
            {images.coaching && (
              <picture>
                <source media="(min-width: 769px)" srcSet={images.coaching} />
                <img src={images.introCoaching} alt="Coach mentoring young football players" />
              </picture>
            )}
            <span className="image-tag">DEVELOPMENT THROUGH MENTORSHIP</span>
          </div>

          <div className="mentorship-content">
            <p>
              The right guidance can change a player's journey. We believe in
              creating an environment where young athletes are challenged,
              supported and encouraged to become their best.
            </p>
            <a className="text-link dark-link" href="/coaches">
              Learn more about ItaBEES <span>→</span>
            </a>
            <h3 className="coach-section-heading">MEET OUR ESTEEMED COACHES.</h3>
            <div className="coach-names">{coachingTeam.map(({ name, role, image, praise }) => <article className="home-coach-card" key={name}><div className="home-coach-photo"><img src={image} alt={`${name}, ${role}`} loading="lazy" /><div className="home-coach-label"><strong>{name}</strong><span>{role}</span></div><p className="home-coach-praise"><CoachPraise text={praise} /></p></div></article>)}</div>
          </div>
        </section>

        <section className="international-section reveal"><div className="editorial-copy"><p className="eyebrow">INTERNATIONAL EXPERIENCES</p><h2>The Game Is Global.<br /><span>Your Perspective Should Be Too.</span></h2><p>Soccer can introduce young players to people, cultures and opportunities far beyond their local community.</p><p>Through strategic relationships and international experiences, ItaBEES aims to expose players to different training environments, coaching philosophies and levels of competition.</p><p>These experiences aren't shortcuts or guarantees. They are opportunities to learn, compete, be evaluated and better understand what higher levels of the game demand.</p><a className="text-link dark-link" href={contactUrl}>Explore International Opportunities <span><ArrowUpRight /></span></a></div><div className="editorial-photo"><img src={images.team} alt="ItaBEES coaching team" /></div></section>

        <section className="college-section reveal"><div className="editorial-photo"><img src={images.academy} alt="Soccer and education" /><div className="college-photo-title"><p className="eyebrow">COLLEGE PATHWAY</p><h2>Preparing Student-Athletes for<br /><span>More Than the Next Game.</span></h2></div></div><div className="editorial-copy"><p className="eyebrow">COLLEGE PATHWAY</p><h2>Preparing Student-Athletes for<br /><span>More Than the Next Game.</span></h2><p>Playing college soccer requires more than talent.</p><p>Student-athletes must understand academics, recruiting, communication, eligibility, exposure and how to identify programs that fit both their athletic and educational goals.</p><p>ItaBEES helps families navigate that journey with greater clarity while preparing players to confidently present themselves as both students and athletes.</p><a className="text-link dark-link" href={contactUrl}>Explore the College Pathway <span><ArrowUpRight /></span></a></div></section>

        <section className="events-section reveal" id="events"><div><p className="eyebrow">UPCOMING EVENTS</p><h2>What's <span>Next.</span></h2></div><a className="text-link dark-link" href="/events">VIEW ALL EVENTS <span><ArrowUpRight /></span></a><p className="events-empty">No events at the moment</p></section>

        <section className="opportunities-section reveal" id="opportunities">
          <div className="opportunities-photo"><img src={images.team} alt="ItaBEES coaches and academy banner" /></div>
          <p className="eyebrow">OPEN UP THE POSSIBILITIES</p>
          <h2>
            The journey doesn't
            <br />
            <span>stop at the pitch.</span>
          </h2>
          <p className="opportunities-copy">
            From camps and clinics to international experiences and college
            pathways, we want players to see what is possible and feel prepared
            to pursue their ambitions.
          </p>

          <div className="opportunity-links">
            <a href="/camps-and-clinics">
              <span>01</span> Camps & Clinics <span><ArrowUpRight /></span>
            </a>
            <a href="/international-experiences">
              <span>02</span> International Experiences <span><ArrowUpRight /></span>
            </a>
            <a href="/college-pathway">
              <span>03</span> College Pathway <span><ArrowUpRight /></span>
            </a>
            <a href="/assessments">
              <span>04</span> Player Assessments <span><ArrowUpRight /></span>
            </a>
          </div>
        </section>

        <section className="final-cta reveal" id="contact">
          <div className="cta-decoration">iB</div>
          <p className="eyebrow">YOUR JOURNEY STARTS HERE</p>
          <h2>
            READY TO
            <br />
            <span>TAKE THE NEXT STEP?</span>
          </h2>
          <p>
            Every great journey begins with a first step. Let's discover what is
            possible together.
          </p>
          <a className="button button-black" href={bookUrl}>
            Connect with ItaBEES <span><ArrowUpRight /></span>
          </a>
        </section>
      </main>


    </>
  );
}

