import type { Schedule, Suggestion } from "../models/lifeos"
export interface Store {
	getSchedule(week: string, userId: string): Promise<Schedule | null>
	saveSchedule(s: Schedule, userId: string): Promise<void>
	listSuggestions(userId: string, limit?: number): Promise<Suggestion[]>
	addSuggestion(
		s: Omit<Suggestion, "id" | "createdAt">,
		userId: string
	): Promise<void>
}
