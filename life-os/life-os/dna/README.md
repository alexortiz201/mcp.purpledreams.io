
# 🧬 Life-OS DNA — Semantic Genome

> **Purpose:** Define the structure, meaning, and progression system for the Life-OS ecosystem.  
> **Scope:** Ontology, templates, and metadata only (no logic).

---

## 📘 Overview

`life-os-dna` contains the **foundational definitions** that the rest of Life-OS builds upon.
It describes what “Goals”, “Projects”, “Tasks”, “Phases”, and “XP” *mean* — not how they behave.

This repository acts as the **semantic contract** between human intent and AI reasoning.

---

## 🧩 Contents

```bash
life-os-dna/
├── manifest.jsonc            # Core ontology, XP rules, phases, relationships
├── templates/                # Canonical templates (Goal, Project, Task)
├── concepts/                 # Documentation of systems and meaning models
│   ├── xp-system.md
│   ├── phases.md
│   └── relationships.md
└── ai-notes/                 # Meta files for AI reasoning and system context
```

---

## ⚙️ Role in the System

| Layer | Function | Consumes / Produces |
|:--|:--|:--|
| 🧬 **DNA** | Defines structure & meaning | Output of human design |
| 🧫 **RNA** | Translates meaning into behavior | Consumes DNA |
| 💎 **Expression** | Generates artifacts | Output of RNA |

AI agents or compilers can parse `manifest.jsonc` to understand:
- Hierarchical relationships (`goals → projects → tasks`)
- XP rules and phase multipliers
- Icons, symbols, and conceptual metadata
- Limits, constraints, and ontology boundaries

---

## 🧠 AI Readability

All files are **JSONC** (JSON + comments) and **Markdown**, intentionally human + machine-readable.

AI systems can:
- Parse manifest schema for structure
- Read markdown descriptions as meaning anchors
- Infer relationships for reasoning or task generation

---

## 🔬 Design Philosophy

> “Separate **meaning** (DNA) from **mechanism** (RNA).”

This separation allows Life-OS to evolve —  
you can redesign goals, XP systems, or phases without rewriting logic.

---

## 🚀 Future: Schema Evolution

Eventually `life-os-dna` will export a typed schema:

```ts
import type { LifeOSManifest } from "@alexortiz201/life-os-dna"
```

Allowing runtime validation and generative compilation into themes.

---

## 🪶 License

MIT © 2025 — Designed by **Alex Ortiz**
