import type { Middleware } from "@remix-run/fetch-router"
import Headers from "@remix-run/headers"
import type { Props } from "../mcp"

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "content-type", // Authorization
}
const getCorsHeaders = () => new Headers(CORS_HEADERS)

// export const getCorsHeaders = () => ({ ...CORS_HEADERS })

// export function withCors<Props>({
// 	getCorsHeaders,
// 	handler,
// }: {
// 	getCorsHeaders(
// 		request: Request
// 	): Record<string, string> | Headers | null | undefined
// 	handler: CustomExportedHandler<Props>["fetch"]
// }): CustomExportedHandler<Props>["fetch"] {
// 	return async (request, env, ctx) => {
// 		const corsHeaders = getCorsHeaders(request)
// 		if (!corsHeaders) {
// 			return handler(request, env, ctx)
// 		}

// 		// Handle CORS preflight requests
// 		if (request.method === "OPTIONS") {
// 			const headers = mergeHeaders(corsHeaders, {
// 				"Access-Control-Max-Age": "86400",
// 			})

// 			return new Response(null, { status: 204, headers })
// 		}

// 		// Call the original handler
// 		const response = await handler(request, env, ctx)

// 		// Add CORS headers to ALL responses, including early returns
// 		const newHeaders = mergeHeaders(response.headers, corsHeaders)

// 		if (request.url.includes("widgets/calculator.js")) {
// 			console.log(request.url, response.body)
// 			console.log("corsHeaders", corsHeaders)
// 			console.log("response.headers", response.headers)
// 			console.log("mergedHeaders", newHeaders)
// 		}

// 		return new Response(response.body, {
// 			status: response.status,
// 			statusText: response.statusText,
// 			headers: newHeaders,
// 		})
// 	}
// }

/**
 * Merge multiple headers objects into one (uses set so headers are overridden)
 */
export function mergeHeaders(
	...headers: Array<ResponseInit["headers"] | null | undefined>
) {
	const merged = new Headers()
	for (const header of headers) {
		if (!header) continue
		for (const [key, value] of new Headers(header).entries()) {
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

export const withCorsMiddleware: Middleware = async (context, next) => {
	const corsHeaders = getCorsHeaders()
	if (!corsHeaders) return next(context)

	const { request, url } = context //  storage,
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
		console.log(url, response.body)
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

// export const withCorsMiddleware: Middleware = createWithCors({ getCorsHeaders })
