import { Link } from "react-router-dom";
import ArrowUpRight from "./ArrowUpRight";

export function PageHero({ eyebrow, title, description, image, mobileImage, imageAlt = "", dark = false, className = "" }) {
  return <section className={`page-hero ${dark ? "page-hero-dark" : ""} ${className}`}>
    <div className="page-hero-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p>{description}</p>}</div>
    {image && <div className="page-hero-image"><picture>{mobileImage && <source media="(min-width: 769px)" srcSet={image} />}<img src={mobileImage || image} alt={imageAlt} /></picture></div>}
  </section>;
}

export function ContentSection({ eyebrow, title, children, tone = "white", image, imageAlt = "", reverse = false }) {
  return <section className={`content-section content-${tone} ${image ? "content-with-image" : ""} ${reverse ? "content-reverse" : ""}`}>
    <div className="content-section-copy"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{children}</div>
    {image && <div className="content-section-image"><img src={image} alt={imageAlt} /></div>}
  </section>;
}

export function ActionLink({ to, children, black = false }) {
  return <Link className={`button ${black ? "button-black" : "button-yellow"}`} to={to}>{children}<span aria-hidden="true"><ArrowUpRight /></span></Link>;
}

export function CardGrid({ items }) {
  return <div className="page-card-grid">{items.map(([title, body]) => <article className="page-card" key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>;
}
