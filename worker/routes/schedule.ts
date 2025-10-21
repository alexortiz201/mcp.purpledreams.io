import {
	createRouter,
	createRoutes,
	type RouteHandlers,
} from "@remix-run/fetch-router"
import { ScheduleSchema } from "../../life-os/models/lifeos"
import { ScheduleService } from "../../life-os/services/schedule"
import { D1Store } from "../../life-os/store/adapters/d1-store"
import { getStorage } from "../utils/utils-route-context"
import { ENV_KEY } from "./adapters/utils-context-cloudflare"

export const scheduleRouter = createRouter()
const routes = createRoutes({
	schedule: {
		index: { method: "GET", pattern: "/schedule" },
		save: { method: "POST", pattern: "/schedule" },
		generate: { method: "POST", pattern: "/schedule/generate" },
	},
})

const handlers = {
	async index({ request }) {
		const env = getStorage().get(ENV_KEY)
		const week = new URL(request.url).searchParams.get("week") ?? "2025-W43"
		const svc = new ScheduleService(new D1Store(env.DB))
		const data = await svc.get(week, "me")
		return new Response(JSON.stringify(data), {
			headers: { "content-type": "application/json" },
		})
	},
	async save({ request }) {
		const env = getStorage().get(ENV_KEY)
		const payload = ScheduleSchema.parse(await request.json())
		const svc = new ScheduleService(new D1Store(env.DB))
		await svc.save(payload, "me")
		return new Response(JSON.stringify({ ok: true }), {
			headers: { "content-type": "application/json" },
		})
	},
	async generate({ request }) {
		const env = getStorage().get(ENV_KEY)
		const url = new URL(request.url)
		const week = url.searchParams.get("week") ?? "2025-W43"
		const svc = new ScheduleService(new D1Store(env.DB))
		const data = await svc.generate(week, "me", false)
		return new Response(JSON.stringify(data), {
			headers: { "content-type": "application/json" },
		})
	},
} satisfies RouteHandlers<typeof routes.schedule>

scheduleRouter.map(routes.schedule, handlers)
