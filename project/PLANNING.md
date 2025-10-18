# 🚀 MCP Server TODO — Life‑OS × MCP (Aligned to Current Repo)

**Repo:** `MCP.PURPLEDREAMS.IO`
**Endpoint (planned):** https://purpledreams.io/mcp
**Deploy target:** Cloudflare Workers
**UI surface:** Vite/React widgets (`/widgets`) + static assets (`/public`)
**Auth:** None for v0; JWT (and/or OAuth) for v1

> This plan **matches your current structure** (worker + widgets + shared types) and extends it with Life‑OS and Oracle tools, typed schemas, and a simple UI client. Everything below slots into your existing folders.

---

## 🧩 Your Current Architecture (observed)

| Layer | Path | Notes |
|---|---|---|
| Worker runtime | `worker/` | Cloudflare Worker entry + utilities (add tool router here) |
| Shared types | `types/` | Keep request/response schemas & TS types here |
| UI widgets | `widgets/` | React/Vite widgets (calculator etc.) — add Life‑OS & Oracle widgets here |
| Utilities | `utils/` | `utils-mcp.ts` (worker client), `utils-mcp-ui.tsx` (UI helpers) |
| Public assets | `public/` | Logos, theme assets |
| Build configs | `tsconfig.*.json`, `vite.config.widgets.ts` | Already isolated — good |
| Worker config | `wrangler.jsonc` | Bind D1/KV later; route `/mcp` |

---

## 🍰 v0 Scope (no Auth) — Small, End‑to‑End

- **Worker**: `lifeos.*` (read list + append suggestion + log xp) and `oracle.*` (static resume/bio/faq)
- **UI**: minimal dev console widget to call tools & show JSON
- **Data**: D1 for xp/suggestions; file‑first for Obsidian notes (append suggestions to Markdown later)
- **DX**: typed schemas, request helpers, health check, analytics

---

## 0) Repo Hygiene & Structure (update)

- [ ] Add folders & index barrels:
```
worker/
  tools/
    lifeos.ts
    oracle.ts
    index.ts            # export route(map) for tools
  schemas/
    lifeos.add_suggestion.input.json
    lifeos.log_xp.input.json
    common.list_request.json
  db/
    schema.sql
  router.ts            # parse tool calls + dispatch
  types.ts             # worker‑side shared types
widgets/
  lifeos/
    DevConsole.tsx     # call any tool, view JSON, save requests
    Dashboard.tsx      # (later) arcs/XP overview
  oracle/
    ProfilePortal.tsx  # (later) public read‑only UI
types/
  mcp.ts               # exported types for client + worker
utils/
  utils-mcp.ts         # typed client for calling /mcp
  utils-mcp-ui.tsx     # UI helpers (toasts, json pretty, etc.)
```
- [ ] Add `README_MCP.md` with curl examples & tool registry
- [ ] `.env.example` (no secrets), update `.gitignore`

---

## 1) Worker MVP (Cloudflare) — Routes & Tool Calls

- [ ] `worker/router.ts` — validate payload & dispatch
```ts
// worker/router.ts
export type ToolCall = { tool: string; input?: unknown };

export async function routeTool(call: ToolCall, env: Env) {
  switch (call.tool) {
    case "lifeos.list_arcs":      return (await import("./tools/lifeos")).listArcs(env);
    case "lifeos.get_week":       return (await import("./tools/lifeos")).getWeek(env);
    case "lifeos.add_suggestion": return (await import("./tools/lifeos")).addSuggestion(call.input, env);
    case "lifeos.log_xp":         return (await import("./tools/lifeos")).logXp(call.input, env);
    case "lifeos.shadow_encounter": return (await import("./tools/lifeos")).shadowEncounter(call.input, env);
    case "oracle.resume":         return (await import("./tools/oracle")).resume(env);
    case "oracle.bio":            return (await import("./tools/oracle")).bio(env);
    case "oracle.faq":            return (await import("./tools/oracle")).faq(env);
    default: return Response.json({ ok:false, error:"unknown_tool", tool: call.tool }, { status: 400 });
  }
}
```
- [ ] Worker entry: `worker/index.ts` — POST `/mcp` accepts `{ tool, input }`
```ts
// worker/index.ts
import { routeTool } from "./router";
export default { fetch: async (req: Request, env: Env) => {
  const url = new URL(req.url);
  if (url.pathname === "/mcp/health") return new Response(JSON.stringify({ ok:true, version:"2025-10-18" }));
  if (url.pathname === "/mcp" && req.method === "POST") {
    const body = await req.json();
    return routeTool(body, env);
  }
  return new Response("Not found", { status: 404 });
}};
```
- [ ] `wrangler.jsonc` — route `/mcp*`, bind **D1** (e.g., `DB`), optional **KV**
- [ ] CORS: allow localhost dev origin

---

## 2) Schemas & Types (shared)

- [ ] Put JSON Schemas in `worker/schemas/` and export **TS types** in `types/mcp.ts`
```ts
// types/mcp.ts
export type XPKind = "deep_work" | "soccer" | "father_son_lab" | "shadow_encounter" | "journal";
export interface LogXpInput { kind: XPKind; points: number; note?: string; }
export interface SuggestionInput { title: string; url: string; tags: string[]; reason?: string; }
export interface ListRequest { cursor?: string; limit?: number; }
```
- [ ] Use Ajv in the Worker to validate `input` against schema per tool

---

## 3) Tools — Life‑OS & Oracle (v0)

### 3.1 Life‑OS (`worker/tools/lifeos.ts`)
- [ ] `listArcs()` → static list for now: Front‑End, MCP, Cloud, Robotics
- [ ] `getWeek()` → returns stub of your Weekly_Dashboard (later read from file/db)
- [ ] `addSuggestion(input)` → insert into D1 table `suggestions`
- [ ] `logXp(input)` / `shadowEncounter(input)` → insert into D1 table `xp_events`

### 3.2 Oracle (`worker/tools/oracle.ts`)
- [ ] `resume()` → curated JSON (headline, skills, highlights, selected projects)
- [ ] `bio()` → short + long string payloads
- [ ] `faq()` → whitelist Q&A only

---

## 4) Database (D1) & Migrations

- [ ] `worker/db/schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS xp_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  kind TEXT NOT NULL,
  points INTEGER NOT NULL,
  note TEXT,
  ts INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS suggestions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  tags_json TEXT NOT NULL,
  reason TEXT,
  ts INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,
  public_bio TEXT,
  resume_json TEXT,
  last_updated INTEGER
);
```
- [ ] Wire D1 binding in `wrangler.jsonc`, add `npm script` to run migration

---

## 5) Client SDK — `utils/utils-mcp.ts`

- [ ] Create a tiny client for the UI & tests
```ts
// utils/utils-mcp.ts
export async function callTool<TOut = unknown>(tool: string, input?: unknown) {
  const res = await fetch("/mcp", { method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({ tool, input }) });
  if (!res.ok) throw new Error(`Tool failed: ${tool}`);
  return (await res.json()) as TOut;
}
```
- [ ] Overload helpers per tool (optional) using `types/mcp.ts`

---

## 6) UI Widgets

### 6.1 Dev Console (fast path)
- [ ] `widgets/lifeos/DevConsole.tsx` — form with `tool` select + JSON editor; show result JSON
- [ ] Use `utils-mcp.ts` under the hood
- [ ] Add link in your main `widgets/index.tsx` to open the console

### 6.2 Dashboard (later)
- [ ] `widgets/lifeos/Dashboard.tsx` — show Arcs, XP summary, this week’s suggestions
- [ ] `widgets/oracle/ProfilePortal.tsx` — read‑only “About me” view

---

## 7) Obsidian Bridge (later)

- **v0**: File‑first — append suggestions to `Core_System/Inputs/Adaptive_Suggestions.md` (through a GitHub repo or local sync script)
- **v1**: DB‑first — Life‑OS data in D1 → exporter to Markdown on schedule
- **Goal**: Obsidian reads Markdown; MCP writes to DB (authoritative)

---

## 8) Auth & Modes (v1)

- [ ] JWT bearer: `Authorization: Bearer <token>`
- [ ] Role claims: `role=user` (full) vs `role=oracle` (read‑only)
- [ ] Guard writes by role; add basic rate limiting for anonymous Oracle
- [ ] Secrets: `JWT_PUBLIC_KEY` via `wrangler secret`

**Privacy guardrails**
- Explicit allowlist for Oracle data; redact anything sensitive

---

## 9) Tests & DX

- [ ] Unit tests: Ajv validation, tool handlers
- [ ] Integration: Miniflare Worker tests
- [ ] Golden files: sample in/out per tool
- [ ] Analytics: log `tool_call`, `tool_success`, `tool_error`

---

## 🔑 ENV & Bindings (Cloudflare)

- [ ] D1: `DB` (binding)
- [ ] KV (optional): `CACHE`
- [ ] Secrets: `JWT_PUBLIC_KEY` (v1)
- [ ] CORS: allow your dev origin

---

## 📜 Tool Registry (docs/example)

```jsonc
{
  "tools": [
    { "name": "lifeos.list_arcs", "input_schema": "worker/schemas/common.list_request.json" },
    { "name": "lifeos.get_week",  "input_schema": "worker/schemas/common.list_request.json" },
    { "name": "lifeos.add_suggestion", "input_schema": "worker/schemas/lifeos.add_suggestion.input.json" },
    { "name": "lifeos.log_xp", "input_schema": "worker/schemas/lifeos.log_xp.input.json" },
    { "name": "lifeos.shadow_encounter", "input_schema": "worker/schemas/lifeos.log_xp.input.json" },
    { "name": "oracle.resume" },
    { "name": "oracle.bio" },
    { "name": "oracle.faq" }
  ]
}
```

---

## ✅ v0 Launch Checklist (aligned to your repo)

- [ ] `/worker` routes live; `/mcp/health` returns OK
- [ ] Tools implemented: `lifeos.list_arcs`, `lifeos.add_suggestion`, `lifeos.log_xp`
- [ ] D1 schema applied; writes succeed
- [ ] `utils-mcp.ts` client working
- [ ] `widgets/lifeos/DevConsole.tsx` calling tools
- [ ] Oracle tools return curated JSON
- [ ] Basic logs + analytics

## 🎯 v1 Targets

- [ ] JWT + roles + rate limiting
- [ ] Weekly recommender tool
- [ ] Life‑OS Dashboard + Oracle portal widgets
- [ ] DB‑first exporter → Markdown
- [ ] Docs site + cURL examples + Postman collection

---

### Notes
- Start **tiny** (v0), then iterate.
- Keep Oracle mode public, read‑only, curated.
- Keep personal tools behind Auth from day one of v1.
