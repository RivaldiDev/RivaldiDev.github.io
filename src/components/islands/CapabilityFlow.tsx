import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { iconFor } from "@/data/icons";

type Cap = { k: string; v: string };

// The build pipeline every product goes through, each step backed by one capability row.
const STEPS: { key: string; label: string; short: string; tags: string[] }[] = [
  { key: "How I work", label: "Spec", short: "Write the spec, then direct the agents", tags: ["Claude Code", "TypeScript"] },
  { key: "Launchpads and liquidity", label: "Chain and contracts", short: "Launch model, pools, locked liquidity", tags: ["Solidity", "Foundry", "Solana", "Uniswap v4", "Orca Whirlpools"] },
  { key: "Onchain payments", label: "Payments and ledger", short: "One signed transaction per action, books that balance", tags: ["viem", "node:sqlite", "x402"] },
  { key: "Fee flywheels", label: "Fee flywheels", short: "What the fees do after launch", tags: ["Morpho", "Squads", "Raydium"] },
  { key: "Trading UX", label: "Trading UI", short: "Quotes, charts, holders, PnL", tags: ["React", "Vite", "lightweight-charts", "Tailwind 4"] },
  { key: "AI agents in production", label: "AI agents", short: "Agents that hold wallets and act", tags: ["Claude Code", "Telegram", "X", "Farcaster"] },
  { key: "Game and economy design", label: "Economy and game", short: "Packs, markets, seasons, oracle scores", tags: ["Fastify", "Postgres", "Privy"] },
  { key: "Ops and security", label: "Ship and harden", short: "VPS, Caddy, tunnels, rate limits, audits", tags: ["Debian", "Caddy", "Cloudflare tunnels", "systemd"] },
];

const HOLD = 4200;

export default function CapabilityFlow({ caps }: { caps: Cap[] }) {
  const byKey = Object.fromEntries(caps.map((c) => [c.k, c.v]));
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // restarts the progress bar
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    timer.current = window.setTimeout(() => { setActive((a) => (a + 1) % STEPS.length); setTick((t) => t + 1); }, HOLD);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [active, paused, tick]);

  const pick = (i: number) => { setActive(i); setTick((t) => t + 1); };
  const step = STEPS[active];

  return (
    <div className="flow" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <ol className="flow__rail" aria-label="Build workflow">
        <div className="flow__line" aria-hidden="true">
          <motion.div className="flow__line-fill" animate={{ height: `${(active / (STEPS.length - 1)) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 26 }} />
          <motion.div className="flow__packet" animate={{ top: `${(active / (STEPS.length - 1)) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 26 }} />
        </div>
        {STEPS.map((s, i) => {
          const on = i === active;
          const done = i < active;
          return (
            <li key={s.key} className={`flow__step${on ? " is-on" : ""}${done ? " is-done" : ""}`}>
              <button type="button" className="flow__btn" onClick={() => pick(i)} onFocus={() => pick(i)} aria-current={on ? "step" : undefined}>
                {on && <motion.span layoutId="flow-active" className="flow__active" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <span className="flow__num mono">
                  <motion.span animate={{ scale: on ? 1.15 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>{String(i + 1).padStart(2, "0")}</motion.span>
                </span>
                <span className="flow__text">
                  <span className="flow__label">{s.label}</span>
                  <span className="flow__short">{s.short}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flow__panel">
        <div className="flow__progress" aria-hidden="true">
          <motion.div key={tick} className="flow__progress-bar" initial={{ scaleX: 0 }} animate={{ scaleX: paused ? undefined : 1 }} transition={{ duration: HOLD / 1000, ease: "linear" }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.article
            key={step.key}
            className="flow__card"
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="flow__kicker mono">step {String(active + 1).padStart(2, "0")} of {String(STEPS.length).padStart(2, "0")}</p>
            <h3 className="flow__title">{step.key}</h3>
            <p className="flow__body" dangerouslySetInnerHTML={{ __html: byKey[step.key] ?? "" }} />
            <div className="cv-item__stack">
              {step.tags.map((t, i) => (
                <motion.span key={t} className="cv-chip" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 300, damping: 20 }}>
                  <img className="cv-chip__i" src={iconFor(t)} alt="" width="20" height="20" loading="lazy" />{t}
                </motion.span>
              ))}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
