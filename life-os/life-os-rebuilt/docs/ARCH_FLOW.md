# 🧭 LIFE‑OS — Architecture & Flow (MVP)

## System overview

```
MCP (Cloudflare Worker)
   ↓
@life-os/life-os
   ↓
DNA (examples, schemas)
+ RNA (logic builder)
+ Theme(s)
   ↓
Expression (user's artifacts)
```

- **MCP Server**: orchestrates state, renders widgets, and provides tool APIs.
- **Life-OS Package**: transforms inputs (DNA + Theme + Tokens) into user-specific Expression.
- **AI Persona**: interprets DNA examples to author personalized content.
- **Expression**: represents the *current world state* (no logic inside).

---

## Expected structure
```
expression/
  persona/sheet.md
  persona/ai-coach-profile.md
  daily/journal.md
  weekly/dashboard.md
  learning/archive.md
  blockers/shadow.md
  categories/<cat>/goals/<goal>/goal.md
  categories/<cat>/goals/<goal>/tasks/main/<task>.md
  categories/<cat>/goals/<goal>/tasks/side/<task>.md
  tasks/daily/<task>.md
  references/links.json
```

---

## Build flow
1. **Tokens** define the user’s data (personas, categories, goals, tasks, etc.).
2. **RNA** reads synthesis rules from `dna/core-system/modules/synthesis.jsonc`.
3. It uses these to materialize the directory and stub artifacts.
4. Each stub includes an AI hint like:
   ```
   <!-- AI: Construct this artifact using DNA example "tasks/main" -->
   ```
5. The AI then reads the example from DNA and *writes* the real artifact.

---

## Key design philosophy
- Templates are **educational examples**, not literal string templates.
- RNA focuses on **structure**; AI focuses on **expression**.
- Expression acts as the **cached runtime state** between the user and AI.

---

## Developer note
When rehydrating or debugging builds, start with:
```bash
node life-os/rna/scripts/build-expression.mjs --tokens life-os/fixtures/tokens.example.json
```
This generates the stubbed Expression bundle at:
`life-os/dist/expression/index.js`
