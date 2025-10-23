// zod schema to validate token payloads before template rendering
import { z } from "zod"

export const PhaseKey = z.enum([
	"foundation",
	"calibration",
	"momentum",
	"expansion",
	"integration",
	"mastery",
	"transcendence",
])

export const TokenBase = z.object({
	date_iso: z.string().optional(),
	iso_week: z.string().optional(),
	week_range: z.string().optional(),

	goal_label: z.string().optional(),
	goal_id: z.string().optional(),

	project_label: z.string().optional(),
	project_title: z.string().optional(),
	project_purpose: z.string().optional(),

	task_title: z.string().optional(),
	task_id: z.string().optional(),
	current_task_title: z.string().optional(),
	objective: z.string().optional(),
	step_1: z.string().optional(),
	step_2: z.string().optional(),
	step_3: z.string().optional(),
	dod_1: z.string().optional(),
	dod_2: z.string().optional(),
	dod_3: z.string().optional(),
	time_block: z.string().optional(),
	streak_days: z.union([z.number(), z.string()]).optional(),
	challenge_or_resistance: z.string().optional(),
	reframe_statement: z.string().optional(),
	action: z.string().optional(),
	bonus_if_reflected: z.union([z.number(), z.string()]).optional(),
	related_task_refs: z.string().optional(),

	xp_task_type: z.enum(["main", "side", "daily", "shadow", "event"]).optional(),

	phase_key: PhaseKey.optional(),
	phase_label: z.string().optional(),
	phase_multiplier: z.union([z.number(), z.string()]).optional(),

	xp_total: z.union([z.number(), z.string()]).optional(),

	weekly_theme: z.string().optional(),
	deep_block_mon: z.string().optional(),
	deep_block_tue: z.string().optional(),
	deep_block_wed: z.string().optional(),
	deep_block_thu: z.string().optional(),
	deep_block_fri: z.string().optional(),
	module_a: z.string().optional(),
	module_b: z.string().optional(),
	condition: z.string().optional(),
	backup_rule: z.string().optional(),
	main_task_title: z.string().optional(),
	side_task_title: z.string().optional(),
	daily_focus: z.string().optional(),
	xp_target: z.union([z.number(), z.string()]).optional(),
	suggestion_1: z.string().optional(),
	suggestion_2: z.string().optional(),
	suggestion_3: z.string().optional(),
	chosen_1: z.string().optional(),
	chosen_2: z.string().optional(),

	health_note: z.string().optional(),
	wealth_note: z.string().optional(),
	love_note: z.string().optional(),
	evolution_note: z.string().optional(),
	task_ref_1: z.string().optional(),
	task_ref_2: z.string().optional(),

	notes: z.string().optional(),
	constraint_1: z.string().optional(),
	constraint_2: z.string().optional(),
	milestone_1: z.string().optional(),
	milestone_2: z.string().optional(),
	milestone_3: z.string().optional(),
	victory_condition: z.string().optional(),
	outcome: z.string().optional(),
	prep_1: z.string().optional(),
	prep_2: z.string().optional(),
})

export type TokenPayload = z.infer<typeof TokenBase>

// Simple guard to replace missing tokens with _TBD_
export function fillTokens(tokens: TokenPayload) {
	return new Proxy(tokens, {
		get(target, prop: string) {
			const v = (target as any)[prop]
			return v == null || v === "" ? "_TBD_" : v
		},
	})
}
