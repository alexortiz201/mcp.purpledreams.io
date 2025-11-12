import { vi } from "vitest"

console.info("[setup.agents] stubbing agents")

// Replace the real "agents" package with a stub for tests.
// vi.mock("agents", () => ({
// 	// You can export anything your Worker expects from this module:
// 	McpAgent: class MockMcpAgent {
// 		send() {
// 			/* no-op or mocked behavior */
// 		}
// 		connect() {
// 			return Promise.resolve("connected")
// 		}
// 	},
// 	// Example: stub constants or helpers if needed
// 	createAgent() {
// 		return { send: () => {}, connect: () => Promise.resolve("ok") }
// 	},
// }))
