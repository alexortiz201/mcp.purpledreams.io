import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { McpAgent } from "agents/mcp"

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
