import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import {
	StartExperienceInput,
	startExperienceSetup,
} from "./startExperienceSetup.tool"

export function registerLifeOsTools(server: Server) {
	server.tool("start_experience_setup", {
		description:
			"Life-OS intake and artifact generation. No args → get intake model; with {answers} → get rendered artifacts.",
		inputSchema: {
			type: "object",
			properties: {
				answers: { type: "object", additionalProperties: true },
				targets: { type: "array", items: { type: "string" } },
			},
			required: [],
		},
		async handler(input) {
			try {
				const args = StartExperienceInput.parse(input)
				return await startExperienceSetup(args || undefined)
			} catch (e) {
				return {
					type: "error",
					error: "Invalid input to start_experience_setup",
				}
			}
		},
	})
}
