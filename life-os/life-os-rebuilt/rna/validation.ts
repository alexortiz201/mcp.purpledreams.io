// life-os/rna/validation.ts
import { z } from "zod"

export const CategoryId = z.string().min(1)
export const TaskGroup = z.enum(["main", "side"])

export const PersonaUser = z.object({
	name: z.string().min(1),
	archetype: z.string().optional(),
	timezone: z.string().optional(),
})

export const AICoachProfileSummary = z.object({
	motivations: z.array(z.string()).optional(),
	friction: z.array(z.string()).optional(),
	recommendations: z.array(z.string()).optional(),
	lastUpdated: z.string().datetime().optional(),
})

export const PersonaAI = z.object({
	theme: z.string().min(1),
	voice: z
		.object({
			tone: z.string().optional(),
			style: z.string().optional(),
		})
		.optional(),
	coachProfile: AICoachProfileSummary.optional(),
})

export const Vision = z.object({
	one_year: z.string().optional(),
	ninety_days: z.string().optional(),
	north_star: z.string().optional(),
})

export const GoalMetric = z.object({
	name: z.string().min(1),
	target: z.string().optional(),
	unit: z.string().optional(),
})

export const Goal = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	why: z.string().optional(),
	timeframe: z.enum(["short", "mid", "long"]).optional(),
	startedAt: z.string().datetime().optional(),
	targetDate: z.string().datetime().optional(),
	status: z.enum(["active", "paused", "done"]).optional(),
	metrics: z.array(GoalMetric).optional(),
})

export const GoalTasks = z.object({
	main: z.array(z.string()).optional(),
	side: z.array(z.string()).optional(),
})

export const TasksTokens = z.object({
	daily: z.array(z.string()).optional(),
	goalScoped: z.record(z.string(), GoalTasks).optional(), // key = goal title
})

export const NudgingPrefs = z.object({
	dailyPrompts: z.boolean().optional(),
	preferredTimes: z.array(z.string().regex(/^\d{2}:\d{2}$/)).optional(),
})

export const ReferenceItem = z.object({
	id: z.string().min(1),
	url: z.string().url(),
	title: z.string().optional(),
	tags: z.array(z.string()).optional(),
})

export const References = z.object({
	consumedIds: z.array(z.string()).optional(),
	items: z.array(ReferenceItem).optional(),
})

export const TokensSchema = z.object({
	persona: z.object({
		user: PersonaUser,
		ai: PersonaAI,
	}),
	vision: Vision,
	categories: z.record(CategoryId, z.array(z.string())),
	goals: z.record(z.string(), Goal).optional(),
	tasks: TasksTokens,
	nudging: NudgingPrefs.optional(),
	theme: z
		.object({
			style: z.string().min(1),
			colors: z.array(z.string()).optional(),
		})
		.optional(),
	references: References.optional(),
})

export type Tokens = z.infer<typeof TokensSchema>
