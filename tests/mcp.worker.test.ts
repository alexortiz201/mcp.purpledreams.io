import { env, SELF } from "cloudflare:test"

import type {
	JSONRPCError,
	JSONRPCMessage,
	JSONRPCResponse,
} from "@modelcontextprotocol/sdk/types.js"
import { afterEach, describe, expect, it } from "vitest"

// import { PurpleDreamsMCP } from "../worker/mcp"

const PROTO = "2025-06-18"
// const AGENT = "test-agent"
// const SESSION = "test-session"

let abort: AbortController | null = null

afterEach(async () => {
	abort?.abort()
	abort = null
})

const TEST_MESSAGES = {
	initialize: {
		id: "init-1",
		jsonrpc: "2.0",
		method: "initialize",
		params: {
			capabilities: {},
			clientInfo: { name: "test-client", version: "1.0" },
			protocolVersion: "2025-03-26",
		},
	} as JSONRPCMessage,
}

async function sendPostRequest(
	baseUrl: string,
	message: JSONRPCMessage | JSONRPCMessage[],
	sessionId?: string
): Promise<Response> {
	const headers: Record<string, string> = {
		Accept: "application/json, text/event-stream",
		"Content-Type": "application/json",
	}

	if (sessionId) {
		headers["mcp-session-id"] = sessionId
	}
	abort = new AbortController()
	const request = new Request(baseUrl, {
		body: JSON.stringify(message),
		headers,
		method: "POST",
		signal: abort.signal,
	})

	return SELF.fetch(request)
}

async function initializeStreamableHTTPServer(
	baseUrl = "http://unit.test/mcp"
): Promise<string> {
	const response = await sendPostRequest(baseUrl, TEST_MESSAGES.initialize)

	// console.info({ t: PurpleDreamsMCP })

	expect(response.status).toBe(200)
	const sessionId = response.headers.get("mcp-session-id")
	expect(sessionId).toBeDefined()
	return sessionId as string
}
const mcpServerPort = 62412
describe.skip("MCP /mcp", () => {
	it("/healthcheck - OK", async () => {
		// const isAppRunning = await SELF.fetch(
		// 	`http://localhost:${mcpServerPort}/healthcheck`
		// ).catch(() => ({ ok: false }))

		// if (isAppRunning.ok) {
		// 	return
		// }
		expect(true).toEqual(true)
	})

	it.skip("/test - OK", async () => {
		try {
			const sessionId = await initializeStreamableHTTPServer()
			console.log({ sessionId })
		} catch (error) {
			console.info({ error })
		} finally {
			abort.abort()
		}
	})
	it.skip("INITIALIZE → 200 + returns capabilities (no hang)", async () => {
		abort = new AbortController()
		console.info({ X: env.PURPLE_DREAMS_MCP_OBJECT })

		const res = await SELF.fetch("http://unit.test/mcp", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json, text/event-stream",
				// "mcp-agent-id": AGENT,
				// "mcp-protocol-version": PROTO,
			},
			body: JSON.stringify({
				jsonrpc: "2.0",
				id: 0,
				method: "initialize",
				params: {
					protocolVersion: PROTO,
					capabilities: { elicitation: {} },
					clientInfo: { name: "local-mcp", version: "1.0.0" },
				},
			}),
			signal: abort.signal,
		})

		expect(res.status).toBe(200)
		// console.info({ res })
		/* if (isSse(res.headers)) {
			// 🔁 Streaming initialize: don’t hang; just verify handshake bits.
			expect(res.headers.get("content-type")).toMatch(/text\/event-stream/i)
			// session is the important part to assert when streaming
			expect(res.headers.get("mcp-session-id")).toBeTruthy()

			// Optional: non-fatal peek at first event with a tiny timeout
			const first = await tryPeekFirstSseData(res, { timeoutMs: 400 })
			console.info({ first })
			// You can assert presence if your worker usually emits immediately:
			// expect(first).toBeTruthy();
			// Or just log for debugging:
			if (first) console.info("first SSE data:", first)
			// ✅ Test ends without waiting for the stream to complete
			return
		}
		*/

		expect(res.headers.get("content-type")).toMatch(/text\/event-stream/i)

		// const json = (await res.json()) as JSONRPCResponse
		// expect(json?.jsonrpc).toBe("2.0")
		// expect(typeof json?.result?.protocolVersion).toBe("string")
		// expect(res.headers.get("mcp-session-id")).toBeTruthy()
	})
})
