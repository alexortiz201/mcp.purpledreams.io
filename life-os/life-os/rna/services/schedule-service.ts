export type ScheduleModule =
	| "Morning"
	| "Deep Work"
	| "Movement"
	| "Lab"
	| "Reflection"

export type ScheduleBlock = {
	start: string // '09:00'
	end: string // '12:00'
	module: ScheduleModule
	notes?: string
}

export type WeeklySchedule = {
	week: string // ISO week '2025-W43'
	blocks: Record<string, ScheduleBlock[]> // day -> blocks
}

export interface ScheduleInputs {
	reflections: string[]
	activeProjects: string[]
}

export class ScheduleService {
	#env

	constructor(env: Record<string, unknown>) {
		this.#env = env
	}

	async generate(
		week: string,
		inputs: ScheduleInputs
	): Promise<WeeklySchedule> {
		console.log({ t: "generate", inputs, env: this.#env })
		const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
		const template: ScheduleBlock[] = [
			{ start: "09:00", end: "12:00", module: "Deep Work" },
			{ start: "12:30", end: "13:00", module: "Movement", notes: "Walk" },
			{ start: "13:00", end: "15:00", module: "Deep Work" },
			{
				start: "17:30",
				end: "18:30",
				module: "Lab",
				notes: "Family/Build time",
			},
			{ start: "22:00", end: "22:20", module: "Reflection" },
		]
		const blocks: Record<string, ScheduleBlock[]> = {}
		for (const d of days) blocks[d] = template
		return { week, blocks }
	}
}
