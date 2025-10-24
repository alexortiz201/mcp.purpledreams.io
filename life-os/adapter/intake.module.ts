export type IntakeQuestion =
	| {
			id: string
			type: "text" | "longtext" | "time"
			label: string
			required?: boolean
	  }
	| { id: string; type: "list"; label: string; min?: number; max?: number }
	| {
			id: string
			type: "select"
			label: string
			options: string[]
			allowCustom?: boolean
	  }

export interface IntakeGroup {
	id: string
	title: string
	questions: IntakeQuestion[]
}
export interface IntakeModule {
	id: string
	title: string
	description?: string
	groups: IntakeGroup[]
	writesTo: { tokens: Record<string, string> }
	defaultTargets: string[]
}

export const INTAKE: IntakeModule = {
	id: "experience.intake.v2",
	title: "Life-OS Experience Setup",
	description:
		"Guided questions to seed tokens & theme before generating your Expression.",
	groups: [
		{
			id: "identity",
			title: "Identity",
			questions: [
				{
					id: "persona.name",
					label: "What should I call you?",
					type: "text",
					required: true,
				},
				{
					id: "persona.archetype",
					label: "What archetype best represents you right now?",
					type: "select",
					options: ["Architect", "Explorer", "Healer", "Strategist", "Artist"],
					allowCustom: true,
				},
			],
		},
		{
			id: "vision",
			title: "Vision & Goals",
			questions: [
				{
					id: "vision.one_year",
					label: "What's your 1-year vision?",
					type: "longtext",
				},
				{
					id: "vision.ninety_days",
					label: "What's most important in the next 90 days?",
					type: "longtext",
				},
				{
					id: "goals.top",
					label: "List your top 3 goals.",
					type: "list",
					max: 3,
				},
			],
		},
		{
			id: "rhythm",
			title: "Rhythm & Focus",
			questions: [
				{
					id: "rhythm.weekly.sync_day",
					label: "Preferred weekly reflection day?",
					type: "select",
					options: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				},
				{
					id: "rhythm.daily.focus_start",
					label: "When do you start your main focus block?",
					type: "time",
				},
			],
		},
		{
			id: "theme",
			title: "Theme & Mood",
			questions: [
				{
					id: "theme.style",
					label: "Which vibe or mood fits you?",
					type: "select",
					options: [
						"Architect’s Odyssey",
						"Zen Minimal",
						"Solarpunk Growth",
						"Analog Garden",
					],
					allowCustom: true,
				},
				{
					id: "theme.colors",
					label: "Any color preferences (hex or keywords)?",
					type: "list",
					max: 5,
				},
			],
		},
	],
	writesTo: {
		tokens: {
			"persona.name": "persona.name",
			"persona.archetype": "persona.archetype",
			"vision.one_year": "vision.one_year",
			"vision.ninety_days": "vision.ninety_days",
			"goals.top": "goals.top",
			"rhythm.weekly.sync_day": "rhythm.weekly.sync_day",
			"rhythm.daily.focus_start": "rhythm.daily.focus_start",
			"theme.style": "theme.style",
			"theme.colors": "theme.colors",
		},
	},
	defaultTargets: [
		"persona.sheet",
		"daily.journal",
		"learning.archive",
		"blockers.shadow",
		"weekly.dashboard",
	],
}

export function answersToTokens(
	answers: Record<string, unknown>
): Record<string, unknown> {
	const out: Record<string, unknown> = {}
	const map = INTAKE.writesTo.tokens
	for (const from in map) {
		if (Object.hasOwn(answers, from)) out[map[from]] = (answers as any)[from]
	}
	return out
}
