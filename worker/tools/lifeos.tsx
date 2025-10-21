import { ScheduleService } from "../../life-os/services/schedule"
import { D1Store } from "../../life-os/store/adapters/d1-store"

export const lifeOsTools = ({ env }: { env: Env }) => ({
	"lifeos.schedule.generate": async ({ week = "2025-W43" } = {}) => {
		const svc = new ScheduleService(new D1Store(env.DB))
		return svc.generate(week, "me", false)
	},
})
