const values = /\b(discipline|purpose|resilience|respect|excellence)\b/gi;
const exactValue = /^(discipline|purpose|resilience|respect|excellence)$/i;

export default function CoachPraise({ text }) {
  return text.split(values).map((part, index) =>
    exactValue.test(part) ? <strong className="coach-value-highlight" key={index}>{part}</strong> : part,
  );
}
