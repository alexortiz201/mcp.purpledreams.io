import { invariant } from "@epic-web/invariant"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { McpAgent } from "agents/mcp"
import { getCorsHeaders, withCors } from "./utils/utils-requests.ts"
import { getResourceRenderToString } from "./widgets/utils/utils-mcp-ui.tsx"
import { registerWidgets } from "./widgets.tsx"

// biome-ignore lint/complexity/noBannedTypes: WIP
export type State = {}
export type Props = {
	baseUrl: string
}
export class PurpleDreamsMCP extends McpAgent<Env, State, Props> {
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
		await registerWidgets(this)
	}
	requireDomain() {
		const baseUrl = this.props?.baseUrl
		invariant(
			baseUrl,
			"This should never happen, but somehow we did not get the baseUrl from the request handler"
		)
		return baseUrl
	}
}

export default {
	fetch: withCors({
		getCorsHeaders,
		handler: async (
			request: Request,
			env: Env,
			ctx: ExecutionContext<Props>
		) => {
			const url = new URL(request.url)

			if (url.pathname === "/mcp") {
				ctx.props.baseUrl = url.origin

				return PurpleDreamsMCP.serve("/mcp", {
					binding: "PURPLEDREAMS_MCP_OBJECT",
				}).fetch(request, env, ctx)
			}

			// Try to serve static assets
			if (env.ASSETS) {
				const response = await env.ASSETS.fetch(request)
				if (response.ok) {
					return response
				}
			}

			if (url.pathname.startsWith("/__dev/widgets")) {
				const htmlString = await getResourceRenderToString({
					resourcePath: "/widgets/calculator.js",
					baseUrl: url.origin,
				})

				return new Response(htmlString, {
					headers: {
						"Content-Type": "text/html",
					},
				})
			}

			return new Response(null, { status: 404 })
		},
	}),
}
