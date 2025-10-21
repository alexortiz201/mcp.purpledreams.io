import { generateSchedule } from "../core/schedule"
import type { Schedule } from "../models/lifeos"
import type { D1Store } from "../store/adapters/d1-store"

export class ScheduleService {
	private store: D1Store

	constructor(store: D1Store) {
		this.store = store
	}

	async generate(week: string, user: string, save = false) {
		const schedule = generateSchedule(week)
		if (save) await this.store.saveSchedule(schedule, user)
		return schedule
	}

	get(week: string, userId: string) {
		return this.store.getSchedule(week, userId)
	}

	save(s: Schedule, userId: string) {
		return this.store.saveSchedule(s, userId)
	}
}
