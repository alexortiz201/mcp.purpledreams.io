import { env, SELF } from "cloudflare:test"
import type {
	JSONRPCError,
	JSONRPCResponse,
} from "@modelcontextprotocol/sdk/types.js"
// import { TEST_EXECUTION_CONTEXT, TestKVNamespace } from "cloudflare-test-utils"
import { beforeEach, describe, expect, it } from "vitest"

const logHelper = async (res) => {
	if (!res.ok) {
		const body = await res.text()
		console.error("❌ initialize failed:", {
			status: res.status,
			headers: res.headers,
			body,
		})
	}
}

// beforeEach(() => {
// 	// Provide test doubles for your bindings (name them to match your Env)
// 	// env.MY_KV = new TestKVNamespace()
// 	// // If you need ExecutionContext in your code:
// 	// env.__TEST_CTX__ = TEST_EXECUTION_CONTEXT
// })

describe("MCP Streamable HTTP", () => {
	it("POST /mcp without session → 400 + -32000", async () => {
		const res = await SELF.fetch("http://unit.test/mcp", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json, text/event-stream",
			},
			body: JSON.stringify({
				jsonrpc: "2.0",
				id: 1,
				method: "initialize",
				params: {},
			}),
		})

		// await logHelper(res)

		expect(res.status).toBe(400)
		expect(res.headers.get("content-type")).toMatch(/application\/json/i)

		const json = (await res.json()) as JSONRPCError
		expect(json?.error?.code).toBe(-32000)
		expect(String(json?.error?.message)).toMatch(
			/Mcp-Session-Id header is required/i
		)
	})

	it.skip("SSE → get Mcp-Session-Id → POST initialize → 200", async () => {
		// 1) Open SSE to create a session
		const sse = await SELF.fetch("http://unit.test/mcp", {
			method: "GET",
			headers: { Accept: "text/event-stream" },
		})
		expect(sse.status).toBe(200)
		expect(sse.headers.get("content-type")).toMatch(/text\/event-stream/i)

		// grab the session id from headers (case-insensitive)
		const sessionId = sse.headers.get("mcp-session-id")
		expect(sessionId).toBeTruthy()

		// 2) POST initialize with the session id (+ Accept includes both)
		const res = await SELF.fetch("http://unit.test/mcp", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json, text/event-stream",
				"Mcp-Session-Id": sessionId as string,
			},
			body: JSON.stringify({
				jsonrpc: "2.0",
				id: 1,
				method: "initialize",
				params: {},
			}),
		})

		expect(res.status).toBe(200)
		expect(res.headers.get("content-type")).toMatch(/application\/json/i)
		// server might echo/refresh session header; tolerate either way
		expect(res.headers.get("mcp-session-id") ?? sessionId).toBeTruthy()

		const json = (await res.json()) as JSONRPCResponse & {
			result: { session: { id: string } }
		}
		expect(json.jsonrpc).toBe("2.0")
		expect(typeof json.result?.protocolVersion).toBe("string")
		expect(typeof json.result?.session?.id).toBe("string")
	})

	// it.only("POST /mcp initialize → 200 + JSON-RPC result", async () => {
	// 	const reqInit = {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			Accept: "application/json, text/event-stream",
	// 		},
	// 		body: JSON.stringify({
	// 			jsonrpc: "2.0",
	// 			id: 1,
	// 			method: "initialize",
	// 			params: {},
	// 		}),
	// 	} as const

	// 	const res = await SELF.fetch("http://unit.test/mcp", reqInit)

	// 	if (!res.ok) {
	// 		const body = await res.text()
	// 		console.error("❌ initialize failed:", {
	// 			status: res.status,
	// 			headers: res.headers,
	// 			body,
	// 		})
	// 	}

	// 	expect(res.status).toBe(200)
	// 	expect(res.headers.get("content-type")).toMatch(/application\/json/i)
	// 	expect(res.headers.get("mcp-session-id")).toBeTruthy()

	// 	const json = (await res.json()) as JsonRpcSuccess
	// 	expect(json.jsonrpc).toBe("2.0")
	// 	expect(typeof json.result?.protocolVersion).toBe("string")
	// 	expect(typeof json.result?.session?.id).toBe("string")
	// })

	// it("POST /mcp invalid JSON → 400 with -32700", async () => {
	// 	const res = await SELF.fetch("http://unit.test/mcp", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			Accept: "application/json, text/event-stream",
	// 		},
	// 		// invalid body
	// 		body: "not json",
	// 	})

	// 	expect(res.status).toBe(400)
	// 	const json = (await res.json()) as JsonRpcError
	// 	expect(json?.error?.code).toBe(-32700)
	// })

	// it("GET /mcp SSE → 200 + first data event is JSON-RPC", async () => {
	// 	const res = await SELF.fetch("http://unit.test/mcp", {
	// 		method: "GET",
	// 		headers: { Accept: "text/event-stream" },
	// 	})

	// 	expect(res.status).toBe(200)
	// 	const reader = res.body?.getReader()
	// 	const td = new TextDecoder()
	// 	const { value } = await reader.read()
	// 	const firstChunk = td.decode(value)
	// 	const line = firstChunk.split(/\r?\n/).find((l) => l.startsWith("data: "))
	// 	expect(line).toBeTruthy()
	// 	const payload = JSON.parse(
	// 		line?.slice("data: ".length) ?? ""
	// 	) as JsonRpcSuccess
	// 	expect(payload.jsonrpc).toBe("2.0")
	// })
})
