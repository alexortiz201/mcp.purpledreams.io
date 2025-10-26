# 🧠 LIFE‑OS — Context Restore Prompt (MVP, Categories → Goals → Tasks)

## What this is
- **MCP Worker** hosts the API + tools.
- **Life-OS** package provides DNA (examples + contexts), RNA (compiler logic), and Expression (current user artifacts).
- **Neutral ontology:** Vision → Categories → Goals → Tasks (goal-scoped main/side; global daily).

## Core principles
- **DNA templates are examples, not string-interpolation templates.**
  - AI reads them to learn *how to write* artifacts.
  - RNA does **not** interpolate variables into DNA; it only materializes structure and stubs.
- **Expression** is logic-free, current user artifacts (markdown + small json).

## First-run
If a user has **no Life-OS instance**:
1. MCP greets the user.
2. Guides them through Persona creation, Theme selection (default = neutral), and Nudging setup.
3. Optionally seeds their first Vision, Category, Goal, and Tasks.
4. Writes the resulting personas and tokens.
5. Materializes the directory structure (Expression) with AI-readable stubs.

If a user **already has an instance**:
- MCP sends greeting, personas, capabilities, and a short *Context Card* (top 3 goals, today’s main task, last journal insight).

## Evolution model
- **Micro-edit:** small, in-place changes (journals, check-ins, etc.).
- **Macro-regen:** structural rebuilds when goals/categories evolve.
- **Reflections:** weekly or monthly summaries produce `learning/archive.md` updates.

## Developer tip
Rehydrating context means you can just include this file + the DNA/RNA/Expression folders, and the MCP will immediately understand how to guide the AI and user through setup and evolution.
