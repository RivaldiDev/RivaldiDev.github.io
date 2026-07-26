/* ============================================================
   rivaldi.dev — app.js
   neural canvas · GitHub API · typing fx · shell · palette
   ============================================================ */

"use strict";

const GH_USER = "RivaldiDev";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. neural network canvas ---------- */
(() => {
  const canvas = $("#net");
  const ctx = canvas.getContext("2d");
  let w, h, nodes = [], mouse = { x: -9999, y: -9999 };

  const resize = () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    const count = Math.min(90, Math.floor((w * h) / 22000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  };

  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      // gentle pull toward cursor
      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 28000) { n.x += dx * 0.0012; n.y += dy * 0.0012; }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(139, 92, 246, 0.55)";
      ctx.fill();
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.14 * (1 - d2 / 16000)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  };

  addEventListener("resize", resize);
  addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();
  if (!reducedMotion) tick();
  else { // draw one static frame
    for (const n of nodes) {
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(139,92,246,0.4)"; ctx.fill();
    }
  }
})();

/* ---------- 2. role typing rotator ---------- */
(() => {
  const el = $("#role-type");
  const roles = ["vibecoder", "full AI agentic dev", "web3 enthusiast", "agent orchestrator", "onchain builder"];
  if (reducedMotion) { el.textContent = roles[0]; return; }
  let ri = 0, ci = 0, deleting = false;

  const step = () => {
    const word = roles[ri];
    el.textContent = word.slice(0, ci);
    let delay = deleting ? 38 : 72;
    if (!deleting && ci === word.length) { deleting = true; delay = 1600; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }
    else ci += deleting ? -1 : 1;
    setTimeout(step, delay);
  };
  step();
})();

/* ---------- 3. hero terminal boot sequence ---------- */
(() => {
  const el = $("#boot-seq");
  const lines = [
    ["t-dim", "$ rivaldi --init --mode=agentic"],
    ["t-green", "[ok] core identity loaded ........... vibecoder"],
    ["t-green", "[ok] agent fleet connected .......... 4 workers"],
    ["t-green", "[ok] wallet detected ................ 0xR1V4...LD1"],
    ["t-cyan", "[sync] chain: ethereum · base ....... live"],
    ["t-violet", "[ai] claude pipeline ................ streaming"],
    ["t-dim", ""],
    ["t-magenta", "» mission: ship interesting things, elegantly."],
    ["t-dim", ""],
    ["t-green", "agent ready. scroll to explore ▼"],
  ];

  if (reducedMotion) {
    el.innerHTML = lines.map(([c, t]) => `<span class="${c}">${t}</span>`).join("\n");
    return;
  }

  let li = 0, ci = 0;
  const spans = [];
  const step = () => {
    if (li >= lines.length) return;
    if (ci === 0) {
      const s = document.createElement("span");
      s.className = lines[li][0];
      el.appendChild(s);
      spans[li] = s;
      if (li > 0) el.insertBefore(document.createTextNode("\n"), s);
    }
    const text = lines[li][1];
    spans[li].textContent = text.slice(0, ++ci);
    if (ci >= text.length) { li++; ci = 0; setTimeout(step, text ? 220 : 60); }
    else setTimeout(step, 14);
    el.scrollTop = el.scrollHeight;
  };
  setTimeout(step, 600);
})();

/* ---------- 4. GitHub API: stats + projects ---------- */

const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c",
  Lua: "#000080", Python: "#3572A5", Solidity: "#AA6746", Go: "#00ADD8",
  Rust: "#dea584", "C#": "#178600", Vue: "#41b883", Svelte: "#ff3e00",
};

const classify = (repo) => {
  const t = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
  if (/web3|crypto|defi|nft|blockchain|chain|ethereum|token|wallet|onchain|fear-greed|solidity|base\b/.test(t)) return "web3";
  if (/\bai\b|agent|claude|gpt|llm|ml|prompt|curated/.test(t)) return "ai";
  return "web";
};

(async () => {
  const grid = $("#projects-grid");
  try {
    const [user, repos] = await Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`).then((r) => r.json()),
      fetch(`https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=100`).then((r) => r.json()),
    ]);

    // stats
    if (user.public_repos != null) {
      const years = new Date().getFullYear() - new Date(user.created_at).getFullYear();
      const stats = { repos: user.public_repos, followers: user.followers, years };
      for (const [key, val] of Object.entries(stats)) {
        const el = $(`[data-stat="${key}"]`);
        if (el) animateCount(el, val);
      }
    }

    if (!Array.isArray(repos)) throw new Error("rate limited");

    const shown = repos
      .filter((r) => !r.fork && r.name.toLowerCase() !== `${GH_USER.toLowerCase()}.github.io`)
      .slice(0, 12);

    grid.innerHTML = "";
    for (const repo of shown) {
      const cat = classify(repo);
      const a = document.createElement("a");
      a.className = "proj";
      a.dataset.cat = cat;
      a.href = repo.homepage || repo.html_url;
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = `
        <div class="proj__head">
          <span class="proj__name">${repo.name}</span>
          <span class="proj__badge proj__badge--${cat}">${cat}</span>
        </div>
        <p class="proj__desc">${repo.description || "No description — the code speaks for itself."}</p>
        <div class="proj__meta">
          ${repo.language ? `<span class="proj__lang"><span class="proj__lang-dot" style="--lc:${LANG_COLORS[repo.language] || "#8b90a5"}"></span>${repo.language}</span>` : ""}
          <span>★ ${repo.stargazers_count}</span>
          <span>↻ ${new Date(repo.pushed_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
        </div>`;
      grid.appendChild(a);
    }
    window.__repos = shown;
  } catch {
    grid.innerHTML = `<div class="grid__error">⚠ GitHub API rate limit hit — projects live at <a href="https://github.com/${GH_USER}?tab=repositories" target="_blank" rel="noopener">github.com/${GH_USER}</a></div>`;
  }
})();

function animateCount(el, target) {
  if (reducedMotion) { el.textContent = target; return; }
  const dur = 1200, t0 = performance.now();
  const frame = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/* ---------- 5. project filters ---------- */
$("#filters").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  $$(".chip").forEach((c) => c.classList.remove("is-active"));
  chip.classList.add("is-active");
  const f = chip.dataset.filter;
  $$("#projects-grid .proj").forEach((p) => {
    p.style.display = f === "all" || p.dataset.cat === f ? "" : "none";
  });
});

/* ---------- 6. interactive shell ---------- */
(() => {
  const out = $("#shell-out");
  const input = $("#shell-in");

  const print = (html, cls = "") => {
    const div = document.createElement("div");
    if (cls) div.className = cls;
    div.innerHTML = html;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  };

  const COMMANDS = {
    help: () => print(
      `<span class="t-cyan">available commands:</span>\n` +
      `  <span class="t-green">whoami</span>     — identity dump\n` +
      `  <span class="t-green">projects</span>   — latest shipped repos\n` +
      `  <span class="t-green">stack</span>      — weapons of choice\n` +
      `  <span class="t-green">contact</span>    — open a channel\n` +
      `  <span class="t-green">gm</span>         — say it back\n` +
      `  <span class="t-green">clear</span>      — wipe the buffer\n` +
      `  <span class="t-dim">…and a few undocumented ones. explore.</span>`
    ),
    whoami: () => print(
      `<span class="t-magenta">Rivaldi</span> — vibecoder · full AI agentic · web3 enthusiast\n` +
      `<span class="t-dim">location:</span> Indonesia 🇮🇩\n` +
      `<span class="t-dim">philosophy:</span> orchestrate agents, curate output, ship vibes.`
    ),
    projects: () => {
      const repos = window.__repos;
      if (!repos) return print(`<span class="t-dim">still syncing with GitHub… try again in a sec.</span>`);
      print(repos.slice(0, 6).map((r) =>
        `<span class="t-cyan">▸ ${r.name}</span> <span class="t-dim">— ${r.description || "no description"}</span>`
      ).join("\n"));
    },
    stack: () => print(
      `<span class="t-cyan">languages:</span>  TypeScript · JavaScript · Lua · Solidity(learning)\n` +
      `<span class="t-cyan">ai:</span>         Claude · agent pipelines · MCP · prompt craft\n` +
      `<span class="t-cyan">web3:</span>       Ethereum · Base · DeFi data · NFT tooling\n` +
      `<span class="t-cyan">runtime:</span>    Next.js · Node · GitHub Pages (this site: zero build!)`
    ),
    contact: () => print(
      `<span class="t-green">email:</span>  <a href="mailto:ripaldialdo001@gmail.com">ripaldialdo001@gmail.com</a>\n` +
      `<span class="t-green">github:</span> <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener">github.com/${GH_USER}</a>`
    ),
    gm: () => print(`<span class="t-magenta">gm gm ☀ — wagmi.</span>`),
    wagmi: () => print(`<span class="t-magenta">we're all gonna make it. 🚀</span>`),
    sudo: () => print(`<span class="t-dim">nice try. this incident will be reported to the agent fleet. 🤖</span>`),
    vibe: () => print(`<span class="t-violet">vibe check passed ✓ — immaculate.</span>`),
    matrix: () => print(`<span class="t-green">wake up, anon… the chain has you. follow the white rabbit. 🐇</span>`),
    ls: () => print(`<span class="t-cyan">about/  projects/  terminal/  contact/  </span><span class="t-dim">.secrets (permission denied)</span>`),
    clear: () => { out.innerHTML = ""; },
  };

  print(`<span class="t-dim">rivaldi.dev shell v2.0 — type <span class="t-green">help</span> to begin.</span>`);

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;
    print(`<span class="t-green">visitor@rivaldi.dev:~$</span> ${raw.replace(/</g, "&lt;")}`);
    const cmd = raw.toLowerCase().split(/\s+/)[0];
    if (COMMANDS[cmd]) COMMANDS[cmd]();
    else print(`<span class="t-dim">command not found: ${cmd.replace(/</g, "&lt;")} — try <span class="t-green">help</span></span>`);
  });

  // focus shell when its section is clicked
  $("#terminal .term--interactive").addEventListener("click", () => input.focus());
})();

/* ---------- 7. command palette (Ctrl+K) ---------- */
(() => {
  const dlg = $("#palette");
  const input = $("#palette-input");
  const list = $("#palette-list");

  const ACTIONS = [
    { label: "Jump → About", k: "goto", run: () => location.hash = "#about" },
    { label: "Jump → Projects", k: "goto", run: () => location.hash = "#projects" },
    { label: "Jump → Terminal", k: "goto", run: () => location.hash = "#terminal" },
    { label: "Jump → Contact", k: "goto", run: () => location.hash = "#contact" },
    { label: "Open GitHub profile", k: "link", run: () => open(`https://github.com/${GH_USER}`, "_blank") },
    { label: "Copy email address", k: "action", run: () => navigator.clipboard?.writeText("ripaldialdo001@gmail.com") },
    { label: "View page source on GitHub", k: "link", run: () => open(`https://github.com/${GH_USER}/${GH_USER}.github.io`, "_blank") },
  ];

  let filtered = ACTIONS, sel = 0;

  const render = () => {
    list.innerHTML = filtered.map((a, i) =>
      `<li class="${i === sel ? "is-sel" : ""}" data-i="${i}">${a.label}<span class="k">${a.k}</span></li>`
    ).join("") || `<li>no matches</li>`;
  };

  const openPalette = () => { dlg.showModal(); input.value = ""; filtered = ACTIONS; sel = 0; render(); input.focus(); };
  const runSel = () => { const a = filtered[sel]; if (a) { dlg.close(); a.run(); } };

  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); dlg.open ? dlg.close() : openPalette(); }
  });
  $("#cmdk-btn").addEventListener("click", openPalette);

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    filtered = ACTIONS.filter((a) => a.label.toLowerCase().includes(q));
    sel = 0; render();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { sel = Math.min(sel + 1, filtered.length - 1); render(); e.preventDefault(); }
    if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
    if (e.key === "Enter") runSel();
  });
  list.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-i]");
    if (li) { sel = +li.dataset.i; runSel(); }
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
})();

/* ---------- 8. scroll reveal ---------- */
(() => {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));
})();

/* ---------- 9. misc ---------- */
$("#year").textContent = new Date().getFullYear();

console.log(
  "%c❯ rivaldi.dev %c agent online — hiring? ripaldialdo001@gmail.com",
  "background:#8b5cf6;color:#05060a;padding:4px 8px;border-radius:6px 0 0 6px;font-weight:bold",
  "background:#0a0c14;color:#22d3ee;padding:4px 8px;border-radius:0 6px 6px 0"
);
