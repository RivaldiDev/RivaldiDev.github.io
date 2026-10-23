// Tech chip → icon file in /assets/icons (Simple Icons slug, or a letter mark fb-<letter>).
const MAP: Record<string, string> = {
  "React 19": "react", "React 18": "react", "React": "react", "Vite": "vite", "Tailwind 4": "tailwindcss", "Hono": "hono",
  "Node 24": "nodedotjs", "Node 22": "nodedotjs", "node:sqlite": "sqlite", "SQLite": "sqlite", "Jupiter": "fb-j",
  "Uniswap v4": "fb-u", "Uniswap v3 and v4": "fb-u", "x402": "fb-x", "Cloudflare Workers": "cloudflareworkers",
  "Cloudflare tunnels": "cloudflare", "TypeScript": "typescript", "Fastify": "fastify", "viem": "fb-v", "viem 2": "fb-v",
  "Privy": "fb-p", "Solidity": "solidity", "VitePress": "vitepress", "Caddy": "caddy", "Next.js": "nextdotjs",
  "@solana/kit": "solana", "@solana/web3.js": "solana", "wallet-adapter": "fb-w", "Orca Whirlpools": "fb-o",
  "Postgres": "postgresql", "grammY": "fb-g", "lightweight-charts": "tradingview", "WebGL2": "webgl", "SSE": "fb-s",
  "sharp": "sharp", "Morpho": "fb-m", "Upstash": "upstash", "Foundry": "fb-f", "Telegram": "telegram", "X": "x",
  "Farcaster": "farcaster", "Raydium SDK v2": "fb-r", "Raydium": "fb-r", "React Query": "reactquery", "Python": "python",
  "Lua": "lua", "Solana": "solana", "Robinhood Chain": "robinhood", "Ethereum": "ethereum", "Base": "fb-b", "BSC": "bnbchain",
  "NEAR": "near", "LayerZero": "fb-l", "Permit2": "fb-p", "Doppler": "fb-d", "Meteora": "fb-m", "Squads": "fb-s",
  "shadcn/ui": "shadcnui", "Radix": "radixui", "Claude Code": "fb-c", "Discord": "discord", "Debian": "debian",
  "systemd": "fb-s", "ufw": "fb-u", "fail2ban": "fb-f", "Vercel": "vercel",
};
export function iconFor(label: string): string {
  const slug = MAP[label] ?? `fb-${label.trim()[0].toLowerCase()}`;
  return `/assets/icons/${slug}.svg`;
}
