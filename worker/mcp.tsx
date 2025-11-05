import { invariant } from "@epic-web/invariant"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { McpAgent } from "agents/mcp"
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
		// await registerTools(this)
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
