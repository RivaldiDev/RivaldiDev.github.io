import { CountingNumber } from "@animate-ui/react/primitives/texts/counting-number";

const STATS: { n: number; label: string }[] = [
  { n: 60, label: "days" },
  { n: 7, label: "products shipped" },
  { n: 15, label: "launchpad boilers" },
  { n: 266, label: "commits on Social Arena" },
];

export default function CvStats() {
  return (
    <div className="cv-stats" role="list">
      {STATS.map((s, i) => (
        <div className="cv-stat" role="listitem" key={s.label}>
          <span className="cv-stat__n">
            <CountingNumber number={s.n} delay={i * 0.12} transition={{ stiffness: 90, damping: 30 }} inView inViewOnce inViewMargin="-40px" />
          </span>
          <span className="cv-stat__l">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
