import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { McpAgent } from "agents/mcp"
import { getCorsHeaders, withCors } from "./utils/utils-requests.ts"

export class PurpleDreamsMCP extends McpAgent {
	server = new McpServer(
		{
			name: "PurpleDreamsMCP",
			version: "1.0.0",
		},
		{
			instructions: `Use this server to talk to my purple dreams.`,
		}
	)
	async init() {
		console.log("PurpleDreamsMCP initialized")
	}
}

export default {
	fetch: withCors({
		getCorsHeaders,
		handler: async (request: Request, env: Env, ctx: ExecutionContext) => {
			const url = new URL(request.url)

			if (url.pathname === "/mcp") {
				return PurpleDreamsMCP.serve("/mcp", {
					binding: "PURPLEDREAMS_MCP_OBJECT",
				}).fetch(request, env, ctx)
			}

			return new Response(null, { status: 404 })
		},
	}),
}
