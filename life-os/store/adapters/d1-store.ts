import type { Schedule, Suggestion } from "../../models/lifeos"
import type { Store } from "../store"

export class D1Store implements Store {
	#db: D1Database

	constructor(db: D1Database) {
		this.#db = db
	}

	async getSchedule(week: string, userId: string) {
		const row = await this.#db
			.prepare(
				"SELECT week_iso,guidance_md,blocks_json FROM schedules WHERE user_id=? AND week_iso=?"
			)
			.bind(userId, week)
			.first()
		return row
			? {
					week: row.week_iso as string,
					guidance: row.guidance_md as string,
					blocks: JSON.parse(row.blocks_json as string) as Schedule["blocks"],
				}
			: null
	}

	async saveSchedule(s: Schedule, userId: string) {
		await this.#db
			.prepare(
				`INSERT INTO schedules(user_id,week_iso,guidance_md,blocks_json)
       VALUES(?,?,?,?)
       ON CONFLICT(week_iso) DO UPDATE SET guidance_md=excluded.guidance_md, blocks_json=excluded.blocks_json`
			)
			.bind(userId, s.week, s.guidance, JSON.stringify(s.blocks))
			.run()
	}

	async listSuggestions(userId: string, limit = 20) {
		const res = await this.#db
			.prepare(
				"SELECT id,title,url,tags_json,reason,priority,created_at FROM suggestions WHERE user_id=? ORDER BY priority DESC, created_at DESC LIMIT ?"
			)
			.bind(userId, limit)
			.all()
		return res.results.map((r: any) => ({
			id: String(r.id),
			title: r.title,
			url: r.url ?? undefined,
			tags: r.tags_json ? JSON.parse(r.tags_json) : undefined,
			reason: r.reason ?? undefined,
			priority: r.priority ?? 0,
			createdAt: r.created_at,
		})) as Suggestion[]
	}

	async addSuggestion(s: Omit<Suggestion, "id" | "createdAt">, userId: string) {
		await this.#db
			.prepare(
				"INSERT INTO suggestions(user_id,title,url,tags_json,reason,priority) VALUES(?,?,?,?,?,?)"
			)
			.bind(
				userId,
				s.title,
				s.url ?? null,
				JSON.stringify(s.tags ?? []),
				s.reason ?? null,
				s.priority ?? 0
			)
			.run()
	}
}
