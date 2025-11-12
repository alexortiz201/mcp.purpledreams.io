import type { Middleware } from "@remix-run/fetch-router"
import Headers from "@remix-run/headers"
import type { Props } from "../mcp"

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "content-type", // Authorization
}

export const getCorsHeaders = () => ({ ...CORS_HEADERS })

export function withCors<Props>({
	getCorsHeaders,
	handler,
}: {
	getCorsHeaders(
		request: Request
	): Record<string, string> | Headers | null | undefined
	handler: CustomExportedHandler<Props>["fetch"]
}): CustomExportedHandler<Props>["fetch"] {
	return async (request, env, ctx) => {
		const corsHeaders = getCorsHeaders(request)
		if (!corsHeaders) {
			return handler(request, env, ctx)
		}

		// Handle CORS preflight requests
		if (request.method === "OPTIONS") {
			const headers = mergeHeaders(corsHeaders, {
				"Access-Control-Max-Age": "86400",
			})

			return new Response(null, { status: 204, headers })
		}

		// Call the original handler
		const response = await handler(request, env, ctx)

		// Add CORS headers to ALL responses, including early returns
		const newHeaders = mergeHeaders(response.headers, corsHeaders)

		if (request.url.includes("widgets/calculator.js")) {
			console.log(request.url, response.body)
			console.log("corsHeaders", corsHeaders)
			console.log("response.headers", response.headers)
			console.log("mergedHeaders", newHeaders)
		}

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders,
		})
	}
}

/**
 * Merge multiple headers objects into one (uses set so headers are overridden)
 */
export function mergeHeaders(
	...headers: Array<ResponseInit["headers"] | null | undefined>
) {
	const merged = new Headers()
	for (const header of headers) {
		if (!header) continue
		for (const [key, value] of new Headers({ ...header }).entries()) {
			merged.set(key, value)
		}
	}
	return merged
}

export type RequestMeta = {
	env: Env
	ctx: ExecutionContext<Props>
	locals?: Record<string, unknown>
}

const requestMeta = new WeakMap<Request, RequestMeta>()

export function setRequestMeta(req: Request, meta: RequestMeta) {
	requestMeta.set(req, meta)
}
export function takeRequestMeta(req: Request): RequestMeta | undefined {
	const meta = requestMeta.get(req)
	// optional: cleanup to avoid holding references longer than needed
	if (meta) requestMeta.delete(req)
	return meta
}

// TODO Make actual middleware
export const withCorsMiddleware: Middleware = async (context, next) => {
	const corsHeaders = new Headers(CORS_HEADERS)
	if (!corsHeaders) return next(context)

	const { request } = context //  storage,
	// const { origin } = new URL(url)
	// const env = storage.get(ENV_KEY)
	// const ctx = storage.get(CTX_KEY)

	// Handle CORS preflight requests
	if (request.method === "OPTIONS") {
		const headers = mergeHeaders(corsHeaders, {
			"Access-Control-Max-Age": "86400",
		})

		return new Response(null, { status: 204, headers })
	}

	// Call the original handler
	const response = await next(context)

	// Add CORS headers to ALL responses, including early returns
	const newHeaders = mergeHeaders(response.headers, corsHeaders)

	// widgets/calculator.js
	if (request.url.includes("__dev/widgets")) {
		console.log(request.url, response.body)
		console.log("corsHeaders", corsHeaders)
		console.log("response.headers", response.headers)
		console.log("mergedHeaders", newHeaders)
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: newHeaders,
	})
}

// utils to debug mcp inspector
function jsonResponse(
	body: unknown,
	extraHeaders: Record<string, string> = {}
) {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { "Content-Type": "application/json", ...extraHeaders },
	})
}

function jsonrpcError(status: number, code: number, message: string) {
	return new Response(
		JSON.stringify({ jsonrpc: "2.0", id: null, error: { code, message } }),
		{
			status,
			headers: { "Content-Type": "application/json" },
		}
	)
}

// Working fetch stup to isolate error flows in fetch endpoints,
// the transport erroring is difficult to trace.
// This is stand alone and connects to inspectors when you call it from:
// /worker/index.ts
// e.g.
// 	 export default handler -> export default { fetch: helperFetch }
export async function helperFetch(request: Request) {
	const url = new URL(request.url)

	if (url.pathname === "/mcp" && request.method === "POST") {
		// Enforce Accept header for Streamable HTTP POST
		const accept = request.headers.get("accept") || ""
		if (
			!accept.includes("application/json") ||
			!accept.includes("text/event-stream")
		) {
			return jsonrpcError(
				406,
				-32000,
				"Not Acceptable: Client must accept both application/json and text/event-stream"
			)
		}

		let msg: any
		try {
			// READ THE BODY ONCE — do NOT call formData() or text() elsewhere
			// If you had a middleware that already read the body, this will throw / return empty.
			msg = await request.json() // or: JSON.parse(await request.text())
		} catch {
			return jsonrpcError(400, -32700, "Parse error: Invalid JSON")
		}

		if (msg?.jsonrpc !== "2.0" || typeof msg?.method !== "string") {
			return jsonrpcError(400, -32700, "Parse error: Invalid JSON")
		}

		if (msg.method === "initialize") {
			const sessionId = crypto.randomUUID()
			const result = {
				protocolVersion: "2025-03-26",
				capabilities: {},
				session: { id: sessionId },
			}
			return jsonResponse(
				{ jsonrpc: "2.0", id: msg.id ?? null, result },
				{ "Mcp-Session-Id": sessionId }
			)
		}

		if (msg.method === "tools/call") {
			return jsonResponse({
				jsonrpc: "2.0",
				id: msg.id ?? null,
				result: {
					content: [{ type: "text", text: "hello from CF Worker MCP" }],
				},
			})
		}

		// Unknown method
		return jsonrpcError(404, -32601, "Method not found")
	}

	if (url.pathname === "/mcp" && request.method === "GET") {
		// SSE stream on the SAME URL
		const accept = request.headers.get("accept") || ""
		if (!accept.includes("text/event-stream")) {
			// GET should only require text/event-stream; don't demand application/json here
			return new Response("Expected text/event-stream", { status: 406 })
		}

		const stream = new ReadableStream({
			start(controller) {
				const send = (obj: unknown) => {
					controller.enqueue(
						new TextEncoder().encode(`data: ${JSON.stringify(obj)}\n\n`)
					)
				}

				// Optional welcome message
				send({
					jsonrpc: "2.0",
					method: "notifications/welcome",
					params: { text: "SSE up from Worker" },
				})

				// Keep alive pings (optional)
				const ping = setInterval(
					() =>
						controller.enqueue(new TextEncoder().encode(": keep-alive\n\n")),
					25_000
				)

				// Close handling
				const cancel = () => clearInterval(ping)
				// No explicit close signal from CF; stream ends when client disconnects.
				// You can add cleanup logic if you track sessions.

				// Save cancel on controller so we can call it on `cancel()` if needed
				;(controller as any)._cancel = cancel
			},
			cancel() {
				const cancel = (this as any)?._cancel
				if (cancel) cancel()
			},
		})

		return new Response(stream, {
			status: 200,
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		})
	}

	return new Response("Not found", { status: 404 })
}
