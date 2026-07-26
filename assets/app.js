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
    "hero.title": "Saya tidak sekadar menulis kode.<br>Saya <em>mengorkestrasi</em>nya.",
    "hero.lead": "Halo, saya <strong>Rivaldi</strong> — developer dari Indonesia yang membangun perangkat lunak bersama agen AI. Dasbor onchain, alat berbasis AI, dan eksperimen di persimpangan antara agen dan Ethereum.",
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
    "terminal.sub": "Shell sungguhan. Coba <code>help</code>, <code>projects</code>, atau <code>stack</code>.",
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
    "hero.title": "I don't just write code.<br>I <em>orchestrate</em> it.",
    "hero.lead": "Hi, I'm <strong>Rivaldi</strong> — a developer from Indonesia building software with AI agents. Onchain dashboards, AI-powered tools, and experiments at the intersection of agents and Ethereum.",
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
    "terminal.sub": "An actual shell. Try <code>help</code>, <code>projects</code>, or <code>stack</code>.",
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
}

$("#lang-toggle").addEventListener("click", () => {
  lang = lang === "id" ? "en" : "id";
  localStorage.setItem("lang", lang);
  applyLang();
});

/* ---------- 2. GitHub API: projects ---------- */

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
    return;
  }
  if (!repoCache) return; // skeletons stay until fetch resolves

  grid.innerHTML = "";
  for (const repo of repoCache) {
    const cat = classify(repo);
    const a = document.createElement("a");
    a.className = "proj";
    a.dataset.cat = cat;
    a.href = repo.homepage || repo.html_url;
    a.target = "_blank";
    a.rel = "noopener";
    a.style.display = activeFilter === "all" || cat === activeFilter ? "" : "none";
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
}

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

/* ---------- 3. project filters ---------- */

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

/* ---------- 4. interactive shell ---------- */

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
      syncing: `<span class="t-dim">still syncing with GitHub… try again in a moment.</span>`,
      notFound: (c) => `<span class="t-dim">command not found: ${c} — try <span class="t-ok">help</span></span>`,
      sudo: `<span class="t-dim">access denied. this incident will be reported to the agent fleet.</span>`,
      gm: `<span class="t-hi">gm gm — wagmi.</span>`,
    },
  };

  const S = () => SHELL[lang];

  const COMMANDS = {
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

  print(S().intro);

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;
    const safe = raw.replace(/</g, "&lt;");
    print(`<span class="t-ok">$</span> ${safe}`);
    const cmd = raw.toLowerCase().split(/\s+/)[0];
    if (COMMANDS[cmd]) COMMANDS[cmd]();
    else print(S().notFound(safe));
  });

  $("#terminal .term").addEventListener("click", () => input.focus());
})();

/* ---------- 5. command palette (Ctrl+K) ---------- */

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

/* ---------- 6. scroll reveal ---------- */

(() => {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));
})();

/* ---------- 7. init ---------- */

applyLang();
