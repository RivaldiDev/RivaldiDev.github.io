// GSAP motion layer: intro timeline for the hero, scroll-driven entrances for every section,
// parallax on previews, staggered chips, rows and cards. Respects prefers-reduced-motion.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

if (!reduced) {
  root.classList.add("gsap");
  gsap.defaults({ ease: "power3.out", duration: 0.9 });

  // --- hero intro -----------------------------------------------------------
  const title = document.querySelector<HTMLElement>(".hero__title");
  if (title) {
    // wrap each word so they can rise one by one; keep <em> and <br> intact
    const wrap = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const part of (node.textContent || "").split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
          const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s);
        }
        node.parentNode?.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName !== "BR") {
        [...node.childNodes].forEach(wrap);
      }
    };
    [...title.childNodes].forEach(wrap);
  }
  const intro = gsap.timeline({ delay: 0.1 });
  intro
    .from(".nav", { y: -24, opacity: 0, duration: 0.7 })
    .from(".hero .eyebrow", { y: 16, opacity: 0, duration: 0.6 }, "-=0.4")
    .from(".hero__title .w", { yPercent: 110, opacity: 0, rotateX: -40, transformOrigin: "50% 100%", stagger: 0.06, duration: 1 }, "-=0.35")
    .from(".hero__role", { opacity: 0, x: -12, duration: 0.6 }, "-=0.5")
    .from(".hero__lead", { opacity: 0, y: 18, duration: 0.7 }, "-=0.45")
    .from(".hero__cta .link-btn", { opacity: 0, y: 14, stagger: 0.1, duration: 0.6 }, "-=0.4")
    .from(".ascii-band", { opacity: 0, y: 30, duration: 1 }, "-=0.3");

  // --- helpers --------------------------------------------------------------
  const enter = (targets: gsap.TweenTarget, vars: gsap.TweenVars, trigger?: Element | null, start = "top 85%") =>
    gsap.from(targets, { ...vars, scrollTrigger: { trigger: (trigger as Element) || (targets as Element), start, once: true } });

  // section headers (index, title, sub) rise together
  document.querySelectorAll<HTMLElement>(".section").forEach((sec) => {
    const heads = sec.querySelectorAll(":scope > .section__index, :scope > .section__title, :scope > .section__sub");
    if (heads.length) enter(heads, { y: 28, opacity: 0, stagger: 0.12, duration: 0.9 }, sec, "top 80%");
  });

  // about cards
  enter(".modes .mode", { y: 40, opacity: 0, stagger: 0.14, duration: 0.9 }, document.querySelector(".modes"));

  // CV sub-section titles and leads
  document.querySelectorAll<HTMLElement>(".cv-sec").forEach((sec) => {
    const t = sec.querySelectorAll(":scope > .cv-sec__title, :scope > .cv-lead");
    if (t.length) enter(t, { y: 22, opacity: 0, stagger: 0.1 }, sec, "top 85%");
  });

  // capability rows slide in from the left, their label a touch later
  document.querySelectorAll<HTMLElement>(".cv-cap").forEach((row) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } });
    tl.from(row, { x: -28, opacity: 0, duration: 0.7 }).from(row.querySelector(".cv-cap__k"), { opacity: 0, x: -10, duration: 0.5 }, "-=0.45");
  });

  // work entries: body rises, preview floats in with a slight scale, bullets and chips stagger
  document.querySelectorAll<HTMLElement>(".cv-item").forEach((item) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 80%", once: true } });
    tl.from(item.querySelector(".cv-item__top"), { y: 24, opacity: 0, duration: 0.7 })
      .from(item.querySelectorAll(".cv-item__role, .cv-item__desc"), { y: 18, opacity: 0, stagger: 0.08, duration: 0.6 }, "-=0.4")
      .from(item.querySelectorAll(".cv-item__list li"), { x: -16, opacity: 0, stagger: 0.07, duration: 0.5 }, "-=0.3")
      .from(item.querySelectorAll(".cv-chip"), { scale: 0.7, opacity: 0, stagger: 0.035, duration: 0.4, ease: "back.out(2)" }, "-=0.3")
      .from(item.querySelector(".cv-shot"), { y: 60, opacity: 0, scale: 0.96, duration: 1.1, ease: "power4.out" }, 0.1);
    // gentle parallax on the screenshot while the entry scrolls past
    const img = item.querySelector<HTMLElement>(".cv-shot img");
    if (img) gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 0.6 } });
  });

  // boiler table rows
  const rows = document.querySelectorAll(".cv-table tbody tr");
  if (rows.length) enter(rows, { opacity: 0, x: -14, stagger: 0.05, duration: 0.5 }, document.querySelector(".cv-table"), "top 85%");

  // stack rows and their chips
  document.querySelectorAll<HTMLElement>(".cv-stack__g").forEach((g) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: g, start: "top 90%", once: true } });
    tl.from(g, { opacity: 0, y: 16, duration: 0.5 }).from(g.querySelectorAll(".cv-chip"), { scale: 0.7, opacity: 0, stagger: 0.03, duration: 0.4, ease: "back.out(2)" }, "-=0.25");
  });

  // terminal, contact and the rest of the generic reveals
  enter(".term", { y: 40, opacity: 0, scale: 0.98, duration: 1 }, document.querySelector(".term"));
  enter(".section--contact .hero__cta .link-btn", { y: 16, opacity: 0, stagger: 0.1 }, document.querySelector(".section--contact"), "top 75%");
  enter(".cv-foot .link-btn", { y: 16, opacity: 0 }, document.querySelector(".cv-foot"), "top 92%");

  // GitHub project cards render later from the API: animate them when they land
  const grid = document.getElementById("projects-grid");
  if (grid) {
    const mo = new MutationObserver(() => {
      const cards = grid.querySelectorAll("a.proj");
      if (!cards.length) return;
      mo.disconnect();
      gsap.from(cards, { y: 30, opacity: 0, stagger: 0.06, duration: 0.7, scrollTrigger: { trigger: grid, start: "top 85%", once: true } });
    });
    mo.observe(grid, { childList: true });
  }

  // magnetic buttons
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll<HTMLElement>(".link-btn, .car-btn, .chip").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
      });
      el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  }

  // keep ScrollTrigger positions right after fonts and lazy images settle
  addEventListener("load", () => ScrollTrigger.refresh());
}
