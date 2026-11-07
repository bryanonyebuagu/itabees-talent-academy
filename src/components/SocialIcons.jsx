export function InstagramIcon() {
  return <svg className="instagram-icon" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5" /><circle cx="12" cy="12" r="4.3" /><circle cx="17.8" cy="6.4" r="1" fill="#fff" stroke="none" /></svg>;
}

export function TikTokIcon() {
  const mark = "M16.4 2c.3 2.6 1.8 4.1 4.3 4.3v3.6a8.4 8.4 0 0 1-4.3-1.3v6.7a6.4 6.4 0 1 1-6.4-6.4c.4 0 .9 0 1.3.1v3.8a2.8 2.8 0 1 0 1.5 2.5V2h3.6Z";
  return <svg className="tiktok-icon" viewBox="0 0 24 24" aria-hidden="true"><path d={mark} fill="#25F4EE" transform="translate(-.8 .5)" /><path d={mark} fill="#FE2C55" transform="translate(.8 -.5)" /><path className="tiktok-core" d={mark} /></svg>;
}
