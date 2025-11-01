import { createRouter } from "@remix-run/fetch-router"
import { logger } from "@remix-run/fetch-router/logger-middleware"
import type { Props } from "../mcp.tsx"
import { setRequestMeta } from "../utils/utils-requests.ts"
import { injectContext } from "./middleware/inject-context.ts"
import { handlers, routes } from "./routes.ts"

const router = createRouter()

router.use(injectContext)

if (process.env.NODE_ENV === "development") router.use(logger())

router.map(routes, handlers)

export default {
	fetch: async function handler(
		request: Request,
		env: Env,
		ctx: ExecutionContext<Props>
	) {
		// 📦 Static assets
		if (env.ASSETS) {
			const resp = await env.ASSETS.fetch(request)
			if (resp.ok) return resp
		}

		setRequestMeta(request, { env, ctx, locals: { userId: "me" } })

		return router.fetch(request)
	},
}
