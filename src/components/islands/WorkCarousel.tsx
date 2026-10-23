import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { iconFor } from "@/data/icons";
import PreviewFrame from "@/components/islands/PreviewFrame";

type Work = {
  id: string; name: string; when: string; role: string; desc: string; bullets: string[]; stack: string[];
  shot: { bar: string; src: string; alt: string };
};

const SWIPE = 60; // px of drag that counts as a swipe

export default function WorkCarousel({ items }: { items: Work[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const n = items.length;

  const go = useCallback((to: number) => {
    const next = ((to % n) + n) % n;
    setDir(next > index || (index === n - 1 && next === 0) ? 1 : -1);
    if (next === index) return;
    setIndex(next);
  }, [index, n]);

  // keyboard arrows while the carousel has focus
  useEffect(() => {
    const el = root.current; if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
    };
    el.addEventListener("keydown", onKey); return () => el.removeEventListener("keydown", onKey);
  }, [go, index]);

  const w = items[index];
  const slide = {
    enter: (d: number) => ({ x: reduce ? 0 : d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: reduce ? 0 : d * -60, opacity: 0 }),
  };
  const item = (i: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.12 + i * 0.05, duration: 0.45, ease: [0.23, 1, 0.32, 1] as const } });

  return (
    <div className="wcar" ref={root} tabIndex={0} aria-roledescription="carousel" aria-label="Work">
      <div className="wcar__head">
        <div className="wcar__tabs" role="tablist">
          {items.map((it, i) => (
            <button key={it.id} role="tab" type="button" aria-selected={i === index} className={`wcar__tab mono${i === index ? " is-on" : ""}`} onClick={() => go(i)}>
              {i === index && <motion.span layoutId="wcar-tab" className="wcar__tab-bg" transition={{ type: "spring", stiffness: 320, damping: 30 }} />}
              <span className="wcar__tab-label">{it.name}</span>
            </button>
          ))}
        </div>
        <div className="wcar__ctl">
          <span className="wcar__count mono">{String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
          <button type="button" className="car-btn mono" aria-label="previous project" onClick={() => go(index - 1)}>←</button>
          <button type="button" className="car-btn mono" aria-label="next project" onClick={() => go(index + 1)}>→</button>
        </div>
      </div>

      <div className="wcar__view">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.article
            key={w.id}
            className="cv-item wcar__slide"
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => { if (info.offset.x < -SWIPE || info.velocity.x < -400) go(index + 1); else if (info.offset.x > SWIPE || info.velocity.x > 400) go(index - 1); }}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${n}: ${w.name}`}
          >
            <div className="cv-item__body">
              <motion.div className="cv-item__top" {...item(0)}>
                <h3 className="cv-item__name">{w.name}</h3>
                <span className="cv-item__when">{w.when}</span>
              </motion.div>
              <motion.p className="cv-item__role" {...item(1)}>{w.role}</motion.p>
              <motion.p className="cv-item__desc" {...item(2)} dangerouslySetInnerHTML={{ __html: w.desc }} />
              <ul className="cv-item__list">
                {w.bullets.map((b, i) => <motion.li key={b} {...item(3 + i)}>{b}</motion.li>)}
              </ul>
              <div className="cv-item__stack">
                {w.stack.map((t, i) => (
                  <motion.span key={t} className="cv-chip" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 + i * 0.04, type: "spring", stiffness: 300, damping: 20 }}>
                    <img className="cv-chip__i" src={iconFor(t)} alt="" width="20" height="20" loading="lazy" />{t}
                  </motion.span>
                ))}
              </div>
            </div>
            <motion.figure className="cv-shot" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}>
              <PreviewFrame bar={w.shot.bar}>
                <img src={w.shot.src} alt={w.shot.alt} loading="lazy" width="1280" height="800" draggable={false} />
              </PreviewFrame>
            </motion.figure>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="wcar__dots" aria-hidden="true">
        {items.map((it, i) => <button key={it.id} type="button" tabIndex={-1} className={`carousel__dot${i === index ? " is-active" : ""}`} onClick={() => go(i)} />)}
      </div>
    </div>
  );
}
