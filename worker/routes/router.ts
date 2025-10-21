// CORS middleware for all API routes
// router.map(routes.api, [cors({ origin: "*" })], handlers)

import { createRouter } from "@remix-run/fetch-router"
import { logger } from "@remix-run/fetch-router/logger-middleware"
import type { Props } from "../mcp.tsx"
import { setRequestMeta } from "../utils/utils-requests.ts"
import { injectContext } from "./middleware/inject-context.ts"
import { routes } from "./routes.ts"
import schedule from "./schedule.ts"

const router = createRouter()

router.use(injectContext)

if (process.env.NODE_ENV === "development") router.use(logger())

router.map(routes.schedule, schedule.handlers)

export const api = {
	async fetch(request: Request, env: Env, ctx: ExecutionContext<Props>) {
		setRequestMeta(request, { env, ctx, locals: { userId: "me" } })
		return router.fetch(request)
	},
}
