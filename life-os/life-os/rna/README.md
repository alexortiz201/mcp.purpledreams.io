
# 🧫 Life-OS RNA — Transformation & Expression Logic

> **Purpose:** Translate Life-OS DNA into usable, dynamic, and themed experiences.  
> **Scope:** Compilers, transformers, and render logic that shape meaning into behavior.

---

## 📘 Overview

`life-os-rna` acts as the **translational layer** between your static ontology (DNA) and dynamic experience (Expression).  
It’s responsible for *reading structure, interpreting intent, and generating contextualized artifacts*.

---

## ⚙️ Responsibilities

| Module | Function | Example |
|:--|:--|:--|
| 🧩 **Compiler** | Parses `life-os-dna/manifest.jsonc` into structured JS objects. | Converts XP rules, relationships, and phases into runtime schema. |
| 🎨 **Themer** | Applies active themes or palettes from `life-os-themes`. | “Architect’s Odyssey” theme overlay for dashboards and UI. |
| 🧠 **Interpreter** | Injects adaptive prompts, logic, and reflections. | Generates Weekly Operating Rhythm based on user’s reflections. |
| 🪄 **Exporter** | Emits markdown or UI-ready artifacts. | Writes new dashboards into `life-os-expression/`. |

---

## 🧬 Flow Diagram

```
life-os-dna (meaning) ──▶ life-os-rna (logic) ──▶ life-os-expression (experience)
       manifest.jsonc           compilers + themes        markdown / UI widgets
```

---

## 🧩 Folder Structure

```bash
life-os-rna/
├── compilers/               # manifest + XP + phase interpreters
│   ├── manifest-compiler.ts
│   ├── xp-compiler.ts
│   └── phase-mapper.ts
├── themer/                  # theme mapping & color palette logic
│   ├── index.ts
│   ├── palette.ts
│   └── typography.ts
├── exporters/               # write markdown, dashboards, widgets
│   ├── expression-writer.ts
│   ├── obsidian-writer.ts
│   └── mcp-writer.ts
├── adapters/                # I/O bridges (e.g., filesystem, Cloudflare KV, AI APIs)
├── schemas/                 # zod or JSON schema definitions
└── README.md
```

---

## 🧠 Design Goals

- **Composable:** Each compiler handles one semantic type (XP, Phase, Task, etc.).  
- **Theme-Aware:** Uses design tokens from `life-os-themes` to render personalized dashboards.  
- **AI-Safe:** Can serialize both human-readable markdown *and* machine-parseable JSON.  
- **Stateless:** Core compilers take inputs and produce deterministic outputs.  

---

## 🧩 Example Compilation Flow

```bash
1. Read manifest.jsonc from life-os-dna/
2. Parse phases, XP rules, and relationships
3. Apply theme overlays (e.g., Architect’s Odyssey)
4. Generate:
   - /life-os-expression/Dashboards/Weekly.md
   - /life-os-expression/XP_Log.md
   - /life-os-expression/Quests/Main_Quests.md
```

---

## 🔮 Future Additions

- **AI Transformers:** Adaptive reflection generation & behavior learning  
- **Dynamic Theming:** Switch themes via user context or season  
- **Graph Builder:** Build cross-domain XP maps & visualizations  

---

## 🪶 License

MIT © 2025 — Designed by **Alex Ortiz**
