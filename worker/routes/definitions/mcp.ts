import type { RouteHandlers } from "@remix-run/fetch-router"
import { PurpleDreamsMCP } from "../../index.tsx"
// import { D1Store } from "../../life-os/store/adapters/d1-store"
import { CTX_KEY, ENV_KEY } from "../middleware/inject-context.ts"
import type { baseAPI } from "../routes.ts"

export default {
	use: [], // [withConext] Example middleware
	handlers: {
		async index({ request, storage }) {
			const { origin } = new URL(request.url)
			const env = storage.get(ENV_KEY)
			const ctx = storage.get(CTX_KEY)

			ctx.props.baseUrl = origin

			return PurpleDreamsMCP.serve("/mcp", {
				binding: "PURPLEDREAMS_MCP_OBJECT",
			}).fetch(request, env, ctx)
		},
	} satisfies RouteHandlers<typeof baseAPI.mcp>,
}
