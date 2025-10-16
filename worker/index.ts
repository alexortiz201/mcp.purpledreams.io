import { PurpleDreamsMCP } from "./mcp/index.ts"

export default {
	fetch: async (request: Request, env: Env, ctx: ExecutionContext) => {
		const url = new URL(request.url)

		if (url.pathname === "/mcp") {
			return PurpleDreamsMCP.serve("/mcp", {
				binding: "PURPLEDREAMS_MCP_OBJECT",
			}).fetch(request, env, ctx)
		}

		return new Response(null, { status: 404 })
	},
}

export { PurpleDreamsMCP }
