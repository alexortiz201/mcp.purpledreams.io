import type { RouteHandlers } from "@remix-run/fetch-router"
// import type { SSEEdgeClientTransport } from "agents/mcp"
import { PurpleDreamsMCP } from "../../index.tsx"
// import { D1Store } from "../../life-os/store/adapters/d1-store"
import { CTX_KEY, ENV_KEY } from "../middleware/inject-context.ts"
import type { baseAPI } from "../routes.ts"

let PURPLE_DREAMS_MCP_INSTANCE: any | null = null

const getDreamsMCP = () => {
	if (PURPLE_DREAMS_MCP_INSTANCE) return PURPLE_DREAMS_MCP_INSTANCE

	PURPLE_DREAMS_MCP_INSTANCE = PurpleDreamsMCP.serve("/mcp", {
		binding: "PURPLEDREAMS_MCP_OBJECT",
	})

	return PURPLE_DREAMS_MCP_INSTANCE
}

export default {
	use: [], // [withConext] Example middleware
	handlers: {
		async index({ request, storage }) {
			const { origin } = new URL(request.url)
			const env = storage.get(ENV_KEY)
			const ctx = storage.get(CTX_KEY)

			ctx.props.baseUrl = origin
			return getDreamsMCP().fetch(request, env, ctx)
		},
		async action({ request, storage }) {
			const { origin } = new URL(request.url)
			const env = storage.get(ENV_KEY)
			const ctx = storage.get(CTX_KEY)

			ctx.props.baseUrl = origin
			return getDreamsMCP().fetch(request, env, ctx)
		},
	} satisfies RouteHandlers<typeof baseAPI.mcp>,
}
