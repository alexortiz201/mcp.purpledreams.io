
# 🔢 Life‑OS DNA Token Dictionary (Theme‑Neutral)

This document lists the **{{tokens}}** that appear in DNA templates. RNA replaces these during compilation and may *skin* names (Goal→Realm, Project→Arc, Task→Quest) depending on the active theme.

> Convention: tokens are **snake_case** inside `{{ ... }}`. Unknown values should be replaced with `_TBD_` by the compiler.

---

## Global / Meta
- `{{date_iso}}` — ISO date like `2025-10-22`
- `{{iso_week}}` — ISO week number like `2025-W43`
- `{{week_range}}` — Human label like `Oct 20–26`

## Goals (theme-neutral)
- `{{goal_label}}` — Display name (e.g., `Wealth`)
- `{{goal_id}}` — Optional stable ID/slug

## Projects
- `{{project_label}}` — Display name (e.g., `MCP`)
- `{{project_title}}` — Free-form title for the project page
- `{{project_purpose}}` — Why this matters

## Tasks
- `{{task_title}}` — Task/quest title
- `{{task_id}}` — Optional ID/slug
- `{{current_task_title}}` — Highlighted active task for a project
- `{{objective}}` — Short objective statement
- `{{step_1}}`,`{{step_2}}`,`{{step_3}}` — Steps
- `{{dod_1}}`,`{{dod_2}}`,`{{dod_3}}` — Definition of Done bullets
- `{{time_block}}` — Time window (e.g., `09:00–11:00`)
- `{{streak_days}}` — Integer count for habit streaks
- `{{challenge_or_resistance}}` — For shadow tasks
- `{{reframe_statement}}` — Cognitive reframe
- `{{action}}` — Small action for shadow task today
- `{{bonus_if_reflected}}` — Optional additive XP for reflections
- `{{task_refs}}` / `{{related_task_refs}}` — Comma-separated references

### Task Types (simple enum)
- `{{xp_task_type}}` — One of `main | side | daily | shadow | event`

## Phases
- `{{phase_key}}` — One of `foundation | calibration | momentum | expansion | integration | mastery | transcendence`
- `{{phase_label}}` — Display label (e.g., `Momentum`)
- `{{phase_multiplier}}` — Numeric multiplier (e.g., `1.2`)

## XP / Scoring
- `{{xp_total}}` — Total XP estimate for a day/week
- XP line pattern used in task templates:
  `XP = {{xp_task_type}} × Phase({{phase_key}}={{phase_multiplier}})`

## Weekly Dashboard
- `{{weekly_theme}}` — Theme/intent label
- `{{deep_block_mon}}` … `{{deep_block_fri}}` — Deep work focus labels
- `{{module_a}}`, `{{module_b}}`, `{{condition}}`, `{{backup_rule}}` — Swap logic
- `{{main_task_title}}`, `{{side_task_title}}`, `{{daily_focus}}` — Weekly picks
- `{{xp_target}}` — Weekly XP target number
- `{{suggestion_1}}`..`{{suggestion_3}}` — Intake suggestions
- `{{chosen_1}}`, `{{chosen_2}}` — Curated picks

## Journal
- `{{health_note}}`, `{{wealth_note}}`, `{{love_note}}`, `{{evolution_note}}`
- `{{task_ref_1}}`, `{{task_ref_2}}`

## Generic
- `{{notes}}`, `{{constraint_1}}`, `{{constraint_2}}`, `{{milestone_1}}`..`{{milestone_3}}`
- `{{victory_condition}}`, `{{outcome}}`, `{{prep_1}}`, `{{prep_2}}`
