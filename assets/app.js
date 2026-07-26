/* ============================================================
   rivaldi.dev — app.js
   i18n (id default / en toggle) · GitHub API · shell · palette
   ============================================================ */

"use strict";

const GH_USER = "RivaldiDev";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- 1. i18n ---------- */

const I18N = {
  id: {
    "nav.about": "Tentang",
    "nav.projects": "Proyek",
    "nav.contact": "Kontak",
    "hero.eyebrow": "Portofolio",
    "hero.title": "Membangun web baru,<br>bersama <em>agen AI</em>.",
    "hero.lead": "Saya <strong>Rivaldi</strong> — developer dari Indonesia. Dasbor onchain, alat berbasis AI, dan eksperimen web3: dirakit cepat, dirilis rapi.",
    "hero.cta1": "Lihat proyek ↓",
    "hero.cta2": "Buka terminal →",
    "about.index": "01 — Identitas",
    "about.title": "Tiga mode. Satu operator.",
    "mode1.body": "Selera di atas boilerplate. Saya menentukan arah, mengkurasi hasil, dan memolesnya sampai terasa tepat. Kecepatan berpikir menjadi kecepatan merilis.",
    "mode2.body": "Alur kerja saya adalah armada agen: meriset, menulis, mereview, dan men-deploy sementara saya mengarahkan. Niat manusia, eksekusi mesin.",
    "mode3.body": "Membangun di tempat nilai bisa diprogram. Analitik DeFi, blockchain explorer, dan perkakas NFT — membaca chain dan mengubahnya menjadi antarmuka yang berguna.",
    "projects.index": "02 — Karya",
    "projects.title": "Langsung dari GitHub",
    "projects.sub": "Daftar ini dirender dari API GitHub setiap kali halaman dimuat — selalu terbaru, tanpa perawatan.",
    "filter.all": "semua",
    "terminal.index": "03 — Interaktif",
    "terminal.title": "Bicara dengan mesin",
    "terminal.sub": "Shell sungguhan. Coba <code>help</code> — atau main <code>snake</code> dan <code>donut</code>.",
    "ascii.hint": "gerakkan kursor · klik untuk riak",
    "terminal.win": "rivaldi.dev — terminal",
    "contact.index": "04 — Kontak",
    "contact.title": "Punya ide?<br><em>Mari kita wujudkan.</em>",
    "contact.sub": "Terbuka untuk kolaborasi, proyek lepas, dan eksperimen onchain yang menarik.",
    "footer.left": `© ${new Date().getFullYear()} Rivaldi · dirancang &amp; dibangun bersama agen AI`,
    "footer.right": "tanpa framework · tanpa build step · GitHub Pages",
    "palette.hint": "↑↓ navigasi · ⏎ jalankan · esc tutup",
    "palette.placeholder": "Ketik perintah…",
    "proj.noDesc": "Tanpa deskripsi — kodenya berbicara sendiri.",
    "grid.error": `Batas API GitHub tercapai — lihat proyek langsung di <a href="https://github.com/${GH_USER}?tab=repositories" target="_blank" rel="noopener">github.com/${GH_USER}</a>`,
    dateLocale: "id-ID",
  },
  en: {
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "hero.eyebrow": "Portfolio",
    "hero.title": "Building the new web,<br>with <em>AI agents</em>.",
    "hero.lead": "I'm <strong>Rivaldi</strong> — a developer from Indonesia. Onchain dashboards, AI-powered tools, and web3 experiments: built fast, shipped clean.",
    "hero.cta1": "View projects ↓",
    "hero.cta2": "Open terminal →",
    "about.index": "01 — Identity",
    "about.title": "Three modes. One operator.",
    "mode1.body": "Taste over boilerplate. I set the direction, curate the output, and polish until it feels right. Speed of thought becomes speed of shipping.",
    "mode2.body": "My workflow is a fleet of agents: researching, writing, reviewing, and deploying while I direct. Human intent, machine execution.",
    "mode3.body": "Building where value is programmable. DeFi analytics, blockchain explorers, and NFT tooling — reading the chain and turning it into useful interfaces.",
    "projects.index": "02 — Work",
    "projects.title": "Live from GitHub",
    "projects.sub": "This grid renders itself from the GitHub API on every page load — always current, zero maintenance.",
    "filter.all": "all",
    "terminal.index": "03 — Interactive",
    "terminal.title": "Talk to the machine",
    "terminal.sub": "An actual shell. Try <code>help</code> — or play <code>snake</code> and <code>donut</code>.",
    "ascii.hint": "move your cursor · click for ripples",
    "terminal.win": "rivaldi.dev — terminal",
    "contact.index": "04 — Contact",
    "contact.title": "Got an idea?<br><em>Let's build it.</em>",
    "contact.sub": "Open to collaborations, freelance work, and interesting onchain experiments.",
    "footer.left": `© ${new Date().getFullYear()} Rivaldi · designed &amp; built with AI agents`,
    "footer.right": "no framework · no build step · GitHub Pages",
    "palette.hint": "↑↓ navigate · ⏎ run · esc close",
    "palette.placeholder": "Type a command…",
    "proj.noDesc": "No description — the code speaks for itself.",
    "grid.error": `GitHub API rate limit hit — projects live at <a href="https://github.com/${GH_USER}?tab=repositories" target="_blank" rel="noopener">github.com/${GH_USER}</a>`,
    dateLocale: "en-US",
  },
};

let lang = localStorage.getItem("lang") || "id";
const T = (key) => I18N[lang][key] || I18N.id[key] || key;

function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach((el) => { el.innerHTML = T(el.dataset.i18n); });
  $("#palette-input").placeholder = T("palette.placeholder");
  $("#lang-toggle").textContent = lang === "id" ? "EN" : "ID";
  renderProjects();
  colorfulize();
}

/* ---------- 1b. colorful text (per-char flat palette colors) ---------- */

const CF_PAL = ["amber", "clay", "sage", "blue"];
let cfOffset = 0;

function colorfulize() {
  $$(".hero__title em, .section__title--big em").forEach((el) => {
    const text = el.textContent;
    el.innerHTML = [...text].map((ch, i) =>
      ch.trim() === ""
        ? ch
        : `<span class="cf" data-i="${i}" style="--cfc: var(--${CF_PAL[(i + cfOffset) % 4]}); animation-delay: ${i * 45}ms">${ch}</span>`
    ).join("");
  });
}

setInterval(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  cfOffset = (cfOffset + 1) % 4;
  $$(".cf").forEach((s) => {
    s.style.setProperty("--cfc", `var(--${CF_PAL[(+s.dataset.i + cfOffset) % 4]})`);
  });
}, 2200);

/* ---------- 1c. dotted glow background (cursor reveal) ---------- */

(() => {
  let raf = 0;
  addEventListener("pointermove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    });
  });
})();

$("#lang-toggle").addEventListener("click", () => {
  lang = lang === "id" ? "en" : "id";
  localStorage.setItem("lang", lang);
  if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(applyLang);
  } else {
    applyLang();
  }
});

/* ---------- 2. interactive ascii field ---------- */

(() => {
  const canvas = $("#ascii");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const RAMP = " ·.:-~=+*x#";
  const CELL_W = 11, CELL_H = 16;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cols, rows, dpr;
  const mouse = { x: -1e4, y: -1e4 };
  let ripples = [];

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `${CELL_H - 3}px "JetBrains Mono", monospace`;
    ctx.textBaseline = "top";
    cols = Math.ceil(w / CELL_W);
    rows = Math.ceil(h / CELL_H);
  };

  const field = (x, y, t) => {
    // slow ink wave
    let v = 0.5 + 0.28 * Math.sin(x * 0.32 + t * 0.7) * Math.cos(y * 0.4 - t * 0.5)
                + 0.16 * Math.sin((x + y) * 0.18 - t * 0.9);
    // cursor torch
    const px = x * CELL_W, py = y * CELL_H;
    const dm = Math.hypot(px - mouse.x, py - mouse.y);
    v += Math.max(0, 1 - dm / 130) * 0.55;
    // click ripples: expanding rings that fade
    for (const r of ripples) {
      const age = t - r.t0;
      const d = Math.hypot(px - r.x, py - r.y);
      v += Math.sin(d * 0.09 - age * 7) * Math.exp(-d * 0.008 - age * 1.6) * r.amp;
    }
    return v;
  };

  const draw = (t) => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const v = Math.max(0, Math.min(1, field(x, y, t)));
        const ch = RAMP[(v * (RAMP.length - 1)) | 0];
        if (ch === " ") continue;
        ctx.fillStyle = `rgba(234, 232, 225, ${0.06 + v * 0.5})`;
        ctx.fillText(ch, x * CELL_W, y * CELL_H);
      }
    }
  };

  let last = 0;
  const loop = (ms) => {
    const t = ms / 1000;
    if (ms - last > 80) { // ~12fps: deliberate, typewriter-like cadence
      last = ms;
      ripples = ripples.filter((r) => t - r.t0 < 3);
      draw(t);
    }
    requestAnimationFrame(loop);
  };

  canvas.addEventListener("pointermove", (e) => {
    const b = canvas.getBoundingClientRect();
    mouse.x = e.clientX - b.left;
    mouse.y = e.clientY - b.top;
  });
  canvas.addEventListener("pointerleave", () => { mouse.x = -1e4; mouse.y = -1e4; });
  canvas.addEventListener("pointerdown", (e) => {
    const b = canvas.getBoundingClientRect();
    ripples.push({ x: e.clientX - b.left, y: e.clientY - b.top, t0: performance.now() / 1000, amp: 0.9 });
  });

  addEventListener("resize", resize);
  resize();
  if (reduced) draw(0);
  else requestAnimationFrame(loop);
})();

/* ---------- 2c. text scramble rotator ---------- */

(() => {
  const el = $("#role-scramble");
  if (!el) return;
  const ROLES = ["vibecoder", "full AI agentic", "web3 enthusiast", "onchain builder"];
  const GLYPHS = "!<>-_\\/[]{}=+*^?#";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let idx = 0;

  const scrambleTo = (text) => {
    const from = el.textContent;
    const len = Math.max(from.length, text.length);
    const start = performance.now(), dur = 700;
    const seed = Array.from({ length: len }, () => Math.random());
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      let s = "";
      for (let i = 0; i < len; i++) {
        const reveal = (i / len) * 0.7 + seed[i] * 0.3;
        if (p >= reveal) s += text[i] || "";
        else if (p > reveal - 0.3) s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        else s += from[i] || "";
      }
      el.textContent = s;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = text;
    };
    requestAnimationFrame(tick);
  };

  setInterval(() => {
    idx = (idx + 1) % ROLES.length;
    scrambleTo(ROLES[idx]);
  }, 3400);
})();

/* ---------- 3. GitHub API: projects ---------- */

const classify = (repo) => {
  const t = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
  if (/web3|crypto|defi|nft|blockchain|chain|ethereum|token|wallet|onchain|fear-greed|solidity|base\b/.test(t)) return "web3";
  if (/\bai\b|agent|claude|gpt|llm|ml|prompt|curated/.test(t)) return "ai";
  return "web";
};

let repoCache = null;
let repoError = false;
let activeFilter = "all";

function renderProjects() {
  const grid = $("#projects-grid");
  if (repoError) {
    grid.innerHTML = `<div class="grid__error">${T("grid.error")}</div>`;
    $("#carousel").style.display = "none";
    return;
  }
  if (!repoCache) return; // skeletons stay until fetch resolves

  grid.innerHTML = "";
  let i = 0;
  for (const repo of repoCache) {
    const cat = classify(repo);
    const a = document.createElement("a");
    a.className = "proj";
    a.dataset.cat = cat;
    a.href = repo.homepage || repo.html_url;
    a.target = "_blank";
    a.rel = "noopener";
    a.style.display = activeFilter === "all" || cat === activeFilter ? "" : "none";
    a.style.setProperty("--i", i++);
    a.innerHTML = `
      <div class="proj__head">
        <span class="proj__name">${repo.name}</span>
        <span class="proj__badge">${cat}</span>
      </div>
      <p class="proj__desc">${repo.description || T("proj.noDesc")}</p>
      <div class="proj__meta">
        ${repo.language ? `<span>${repo.language}</span>` : ""}
        <span>★ ${repo.stargazers_count}</span>
        <span>${new Date(repo.pushed_at).toLocaleDateString(T("dateLocale"), { month: "short", year: "numeric" })}</span>
      </div>`;
    grid.appendChild(a);
  }
  buildCarousel();
}

/* ---------- 3b. featured carousel ---------- */

let carTimer = null;
let carIdx = 0;

function buildCarousel() {
  const track = $("#carousel-track");
  const dots = $("#carousel-dots");
  if (!track || !repoCache) return;
  const top = repoCache.slice(0, 5);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  track.innerHTML = top.map((r) => {
    const cat = classify(r);
    return `
    <a class="slide" href="${r.homepage || r.html_url}" target="_blank" rel="noopener">
      <span class="slide__badge mono proj__badge--${cat}">${cat}</span>
      <h3>${r.name.replace(/-/g, " ")}</h3>
      <p>${r.description || T("proj.noDesc")}</p>
      <span class="slide__meta mono">${r.language ? r.language + " · " : ""}★ ${r.stargazers_count}</span>
    </a>`;
  }).join("");

  dots.innerHTML = top.map((_, i) =>
    `<button class="carousel__dot${i === 0 ? " is-active" : ""}" data-i="${i}" aria-label="slide ${i + 1}"></button>`
  ).join("");

  const go = (i) => {
    carIdx = (i + top.length) % top.length;
    const slide = track.children[carIdx];
    if (slide) track.scrollTo({ left: slide.offsetLeft, behavior: reduced ? "auto" : "smooth" });
  };

  const restart = () => {
    clearInterval(carTimer);
    if (!reduced) carTimer = setInterval(() => go(carIdx + 1), 4500);
  };

  // on* properties so rebuilding on language switch never duplicates listeners
  track.onscroll = () => {
    const i = Math.round(track.scrollLeft / (track.children[0]?.offsetWidth + 16 || 1));
    if (i !== carIdx && track.children[i]) {
      carIdx = i;
      $$(".carousel__dot").forEach((d, di) => d.classList.toggle("is-active", di === i));
    }
  };
  track.onpointerenter = () => clearInterval(carTimer);
  track.onpointerleave = restart;
  dots.onclick = (e) => {
    const b = e.target.closest(".carousel__dot");
    if (b) { go(+b.dataset.i); restart(); }
  };
  $("#car-prev").onclick = () => { go(carIdx - 1); restart(); };
  $("#car-next").onclick = () => { go(carIdx + 1); restart(); };

  carIdx = 0;
  track.scrollTo({ left: 0 });
  restart();
}

/* ---------- 3c. 3d tilt on project cards ---------- */

(() => {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const grid = $("#projects-grid");
  const MAX = 5; // degrees — subtle, not a funfair
  grid.addEventListener("pointermove", (e) => {
    const card = e.target.closest("a.proj");
    if (!card) return;
    const b = card.getBoundingClientRect();
    const rx = ((e.clientY - b.top) / b.height - 0.5) * -2 * MAX;
    const ry = ((e.clientX - b.left) / b.width - 0.5) * 2 * MAX;
    card.style.transform = `perspective(700px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-2px)`;
  });
  grid.addEventListener("pointerout", (e) => {
    const card = e.target.closest("a.proj");
    if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
  });
})();

(async () => {
  try {
    const repos = await fetch(`https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=100`).then((r) => r.json());
    if (!Array.isArray(repos)) throw new Error("rate limited");
    repoCache = repos
      .filter((r) => !r.fork && r.name.toLowerCase() !== `${GH_USER.toLowerCase()}.github.io`)
      .slice(0, 12);
  } catch {
    repoError = true;
  }
  renderProjects();
})();

/* ---------- 4. project filters ---------- */

$("#filters").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  $$(".chip").forEach((c) => c.classList.remove("is-active"));
  chip.classList.add("is-active");
  activeFilter = chip.dataset.filter;
  $$("#projects-grid .proj").forEach((p) => {
    p.style.display = activeFilter === "all" || p.dataset.cat === activeFilter ? "" : "none";
  });
});

/* ---------- 5. interactive shell ---------- */

(() => {
  const out = $("#shell-out");
  const input = $("#shell-in");

  const print = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  };

  const SHELL = {
    id: {
      intro: `<span class="t-dim">rivaldi.dev shell — ketik <span class="t-ok">help</span> untuk mulai.</span>`,
      help:
        `<span class="t-hi">perintah tersedia:</span>\n` +
        `  <span class="t-ok">whoami</span>     — tentang saya\n` +
        `  <span class="t-ok">projects</span>   — repo terbaru\n` +
        `  <span class="t-ok">stack</span>      — perkakas andalan\n` +
        `  <span class="t-ok">contact</span>    — buka jalur komunikasi\n` +
        `  <span class="t-ok">snake</span>      — main ular di sini\n` +
        `  <span class="t-ok">donut</span>      — donat ASCII berputar\n` +
        `  <span class="t-ok">clear</span>      — bersihkan layar\n` +
        `  <span class="t-dim">…dan beberapa yang tidak terdokumentasi.</span>`,
      whoami:
        `<span class="t-hi">Rivaldi</span> — vibecoder · full AI agentic · web3 enthusiast\n` +
        `<span class="t-dim">lokasi:</span> Indonesia\n` +
        `<span class="t-dim">filosofi:</span> arahkan agen, kurasi hasil, rilis dengan rapi.`,
      stack:
        `<span class="t-hi">bahasa:</span>   TypeScript · JavaScript · Lua\n` +
        `<span class="t-hi">ai:</span>       Claude · pipeline agen · MCP\n` +
        `<span class="t-hi">web3:</span>     Ethereum · Base · data DeFi\n` +
        `<span class="t-hi">runtime:</span>  Next.js · Node · GitHub Pages`,
      contact:
        `<span class="t-ok">email:</span>  <a href="mailto:ripaldialdo001@gmail.com">ripaldialdo001@gmail.com</a>\n` +
        `<span class="t-ok">github:</span> <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener">github.com/${GH_USER}</a>`,
      snakeHint: "panah/WASD · q keluar",
      snakeOver: (s) => `<span class="t-hi">permainan selesai — skor: ${s}</span> <span class="t-dim">· ketik snake untuk main lagi</span>`,
      donutHint: "tekan tombol apa saja untuk berhenti…",
      syncing: `<span class="t-dim">masih sinkronisasi dengan GitHub… coba lagi sebentar.</span>`,
      notFound: (c) => `<span class="t-dim">perintah tidak ditemukan: ${c} — coba <span class="t-ok">help</span></span>`,
      sudo: `<span class="t-dim">akses ditolak. insiden ini akan dilaporkan ke armada agen.</span>`,
      gm: `<span class="t-hi">gm gm — wagmi.</span>`,
    },
    en: {
      intro: `<span class="t-dim">rivaldi.dev shell — type <span class="t-ok">help</span> to begin.</span>`,
      help:
        `<span class="t-hi">available commands:</span>\n` +
        `  <span class="t-ok">whoami</span>     — about me\n` +
        `  <span class="t-ok">projects</span>   — latest repos\n` +
        `  <span class="t-ok">stack</span>      — tools of choice\n` +
        `  <span class="t-ok">contact</span>    — open a channel\n` +
        `  <span class="t-ok">snake</span>      — play snake right here\n` +
        `  <span class="t-ok">donut</span>      — spinning ASCII donut\n` +
        `  <span class="t-ok">clear</span>      — wipe the screen\n` +
        `  <span class="t-dim">…and a few undocumented ones.</span>`,
      whoami:
        `<span class="t-hi">Rivaldi</span> — vibecoder · full AI agentic · web3 enthusiast\n` +
        `<span class="t-dim">location:</span> Indonesia\n` +
        `<span class="t-dim">philosophy:</span> direct the agents, curate the output, ship it clean.`,
      stack:
        `<span class="t-hi">languages:</span> TypeScript · JavaScript · Lua\n` +
        `<span class="t-hi">ai:</span>        Claude · agent pipelines · MCP\n` +
        `<span class="t-hi">web3:</span>      Ethereum · Base · DeFi data\n` +
        `<span class="t-hi">runtime:</span>   Next.js · Node · GitHub Pages`,
      contact:
        `<span class="t-ok">email:</span>  <a href="mailto:ripaldialdo001@gmail.com">ripaldialdo001@gmail.com</a>\n` +
        `<span class="t-ok">github:</span> <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener">github.com/${GH_USER}</a>`,
      snakeHint: "arrows/WASD · q to quit",
      snakeOver: (s) => `<span class="t-hi">game over — score: ${s}</span> <span class="t-dim">· type snake to play again</span>`,
      donutHint: "press any key to stop…",
      syncing: `<span class="t-dim">still syncing with GitHub… try again in a moment.</span>`,
      notFound: (c) => `<span class="t-dim">command not found: ${c} — try <span class="t-ok">help</span></span>`,
      sudo: `<span class="t-dim">access denied. this incident will be reported to the agent fleet.</span>`,
      gm: `<span class="t-hi">gm gm — wagmi.</span>`,
    },
  };

  const S = () => SHELL[lang];

  /* --- games (snake + donut) --- */

  let stopGame = null;

  const artLine = () => {
    const div = document.createElement("div");
    div.innerHTML = `<span class="t-art"></span>`;
    out.appendChild(div);
    return div.firstChild;
  };

  function startSnake() {
    if (stopGame) stopGame();
    const W = 26, H = 12;
    let dir = { x: 1, y: 0 }, queued = dir;
    const body = [{ x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }];
    let food = null, score = 0;
    const art = artLine();

    const placeFood = () => {
      do { food = { x: (Math.random() * W) | 0, y: (Math.random() * H) | 0 }; }
      while (body.some((s) => s.x === food.x && s.y === food.y));
    };
    placeFood();

    const render = () => {
      const g = Array.from({ length: H }, () => Array(W).fill(" "));
      g[food.y][food.x] = "•";
      body.forEach((s, i) => { g[s.y][s.x] = i === 0 ? "█" : "▓"; });
      art.textContent =
        "┌" + "─".repeat(W) + "┐\n" +
        g.map((r) => "│" + r.join("") + "│").join("\n") +
        "\n└" + "─".repeat(W) + "┘\n" +
        `  score: ${score} · ${S().snakeHint}`;
      out.scrollTop = out.scrollHeight;
    };

    const key = (e) => {
      const k = e.key.toLowerCase();
      const map = {
        arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1],
        arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0],
      };
      if (map[k]) {
        e.preventDefault();
        const [x, y] = map[k];
        if (x !== -dir.x || y !== -dir.y) queued = { x, y };
      } else if (k === "q" || k === "escape") end(true);
    };

    const end = (announce) => {
      clearInterval(timer);
      removeEventListener("keydown", key, true);
      stopGame = null;
      if (announce) print(S().snakeOver(score));
    };

    const timer = setInterval(() => {
      dir = queued;
      const head = { x: body[0].x + dir.x, y: body[0].y + dir.y };
      if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H ||
          body.some((s) => s.x === head.x && s.y === head.y)) return end(true);
      body.unshift(head);
      if (head.x === food.x && head.y === food.y) { score++; placeFood(); }
      else body.pop();
      render();
    }, 110);

    addEventListener("keydown", key, true);
    stopGame = () => end(false);
    render();
  }

  function startDonut() {
    if (stopGame) stopGame();
    print(`<span class="t-dim">${S().donutHint}</span>`);
    const art = artLine();
    const W = 64, H = 20;
    let A = 1, B = 1;

    const frame = () => {
      const b = Array(W * H).fill(" "), z = Array(W * H).fill(0);
      for (let j = 0; j < 6.28; j += 0.07) {
        for (let i = 0; i < 6.28; i += 0.02) {
          const c = Math.sin(i), d = Math.cos(j), e = Math.sin(A), f = Math.sin(j), g = Math.cos(A);
          const h = d + 2, D = 1 / (c * h * e + f * g + 5);
          const l = Math.cos(i), m = Math.cos(B), n = Math.sin(B), t = c * h * g - f * e;
          const x = (W / 2 + 27 * D * (l * h * m - t * n)) | 0;
          const y = (H / 2 + 13 * D * (l * h * n + t * m)) | 0;
          const o = x + W * y;
          const N = (8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n)) | 0;
          if (y >= 0 && y < H && x >= 0 && x < W && D > z[o]) {
            z[o] = D;
            b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
          }
        }
      }
      let s = "";
      for (let k = 0; k < W * H; k++) s += b[k] + (k % W === W - 1 ? "\n" : "");
      art.textContent = s;
      A += 0.07; B += 0.03;
    };

    const end = () => {
      clearInterval(timer);
      clearTimeout(auto);
      removeEventListener("keydown", key, true);
      stopGame = null;
    };
    const key = () => end();
    const timer = setInterval(frame, 50);
    const auto = setTimeout(end, 60000);

    addEventListener("keydown", key, true);
    stopGame = end;
    frame();
    out.scrollTop = out.scrollHeight;
  }

  const COMMANDS = {
    snake: () => startSnake(),
    ular: () => startSnake(),
    donut: () => startDonut(),
    help: () => print(S().help),
    bantuan: () => print(S().help),
    whoami: () => print(S().whoami),
    stack: () => print(S().stack),
    contact: () => print(S().contact),
    kontak: () => print(S().contact),
    sudo: () => print(S().sudo),
    gm: () => print(S().gm),
    wagmi: () => print(S().gm),
    projects: () => {
      if (!repoCache) return print(S().syncing);
      print(repoCache.slice(0, 6).map((r) =>
        `<span class="t-hi">▸ ${r.name}</span> <span class="t-dim">— ${r.description || "—"}</span>`
      ).join("\n"));
    },
    proyek: () => COMMANDS.projects(),
    ls: () => print(`<span class="t-hi">about/  projects/  terminal/  contact/</span>  <span class="t-dim">.secrets (permission denied)</span>`),
    clear: () => { out.innerHTML = ""; },
  };

  const BANNER = [
    " ___  _              _     _  _ ",
    "| _ \\(_)__ __  __ _ | | __| |(_)",
    "|   /| |\\ V / / _` || |/ _` || |",
    "|_|_\\|_| \\_/  \\__,_||_|\\__,_||_|",
  ].join("\n");

  print(`<span class="t-art t-dim">${BANNER}</span>`);
  print(S().intro);

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;
    if (stopGame) stopGame();
    const safe = raw.replace(/</g, "&lt;");
    print(`<span class="t-ok">$</span> ${safe}`);
    const cmd = raw.toLowerCase().split(/\s+/)[0];
    if (COMMANDS[cmd]) COMMANDS[cmd]();
    else print(S().notFound(safe));
  });

  $("#terminal .term").addEventListener("click", () => input.focus());
})();

/* ---------- 6. command palette (Ctrl+K) ---------- */

(() => {
  const dlg = $("#palette");
  const input = $("#palette-input");
  const list = $("#palette-list");

  const ACTIONS = () => [
    { label: lang === "id" ? "Lompat → Tentang" : "Jump → About", k: "goto", run: () => location.hash = "#about" },
    { label: lang === "id" ? "Lompat → Proyek" : "Jump → Projects", k: "goto", run: () => location.hash = "#projects" },
    { label: lang === "id" ? "Lompat → Terminal" : "Jump → Terminal", k: "goto", run: () => location.hash = "#terminal" },
    { label: lang === "id" ? "Lompat → Kontak" : "Jump → Contact", k: "goto", run: () => location.hash = "#contact" },
    { label: lang === "id" ? "Buka profil GitHub" : "Open GitHub profile", k: "link", run: () => open(`https://github.com/${GH_USER}`, "_blank") },
    { label: lang === "id" ? "Salin alamat email" : "Copy email address", k: "aksi", run: () => navigator.clipboard?.writeText("ripaldialdo001@gmail.com") },
    { label: lang === "id" ? "Ganti bahasa (EN/ID)" : "Switch language (EN/ID)", k: "aksi", run: () => $("#lang-toggle").click() },
  ];

  let filtered = [], sel = 0;

  const render = () => {
    list.innerHTML = filtered.map((a, i) =>
      `<li class="${i === sel ? "is-sel" : ""}" data-i="${i}">${a.label}<span class="k">${a.k}</span></li>`
    ).join("") || `<li>—</li>`;
  };

  const openPalette = () => { dlg.showModal(); input.value = ""; filtered = ACTIONS(); sel = 0; render(); input.focus(); };
  const runSel = () => { const a = filtered[sel]; if (a) { dlg.close(); a.run(); } };

  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); dlg.open ? dlg.close() : openPalette(); }
  });
  $("#cmdk-btn").addEventListener("click", openPalette);

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    filtered = ACTIONS().filter((a) => a.label.toLowerCase().includes(q));
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

/* ---------- 7. scroll reveal ---------- */

(() => {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));
})();

/* ---------- 8. init ---------- */

applyLang();
