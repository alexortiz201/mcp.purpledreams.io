export type CategoryId =
	| "health"
	| "wealth"
	| "love"
	| "evolution"
	| (string & {})
export type TaskGroup = "main" | "side"

export interface PersonaUser {
	name: string
	archetype?: string
	timezone?: string
}
export interface AICoachProfileSummary {
	motivations?: string[]
	friction?: string[]
	recommendations?: string[]
	lastUpdated?: string
}
export interface PersonaAI {
	theme: string
	voice?: { tone?: string; style?: string }
	coachProfile?: AICoachProfileSummary
}
export interface Vision {
	one_year?: string
	ninety_days?: string
	north_star?: string
}
export interface GoalMetric {
	name: string
	target?: string
	unit?: string
}
export interface Goal {
	id: string
	title: string
	why?: string
	timeframe?: "short" | "mid" | "long"
	startedAt?: string
	targetDate?: string
	status?: "active" | "paused" | "done"
	metrics?: GoalMetric[]
}
export interface GoalTasks {
	main?: string[]
	side?: string[]
}
export interface TasksTokens {
	daily?: string[]
	goalScoped?: Record<string, GoalTasks>
}
export interface NudgingPrefs {
	dailyPrompts?: boolean
	preferredTimes?: string[]
}
export interface ReferenceItem {
	id: string
	url: string
	title?: string
	tags?: string[]
}
export interface References {
	consumedIds?: string[]
	items?: ReferenceItem[]
}

export interface Tokens {
	persona: { user: PersonaUser; ai: PersonaAI }
	vision: Vision
	categories: Record<CategoryId, string[]>
	goals?: Record<string, Goal>
	tasks: TasksTokens
	nudging?: NudgingPrefs
	theme?: { style: string; colors?: string[] }
	references?: References
}
