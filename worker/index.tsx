import expression from "@life-os/life-os/expression"
import { start_experience_setup } from "../life-os/life-os-rebuilt/worker/tools/start_experience_setup.ts"
import { type Props, PurpleDreamsMCP } from "./mcp.tsx"
import { api } from "./routes/router.ts"
import { getCorsHeaders, withCors } from "./utils/utils-requests.ts"
import { getResourceRenderToString } from "./widgets/utils/utils-mcp-ui.tsx"

export { PurpleDreamsMCP }

export default {
	fetch: withCors({
		getCorsHeaders,
		handler: async (
			request: Request,
			env: Env,
			ctx: ExecutionContext<Props>
		) => {
			const url = new URL(request.url)
			const { pathname } = url

			if (pathname === "/health") return new Response("ok")

			// 🧩 Unified Life-OS API router
			if (pathname.startsWith("/api")) return await api.fetch(request, env, ctx)
			if (url.pathname === "/life-os/expression") {
				return new Response(JSON.stringify(expression), {
					headers: { "content-type": "application/json" },
				})
			}
			if (url.pathname === "/life-os/artifact") {
				const id = url.searchParams.get("id") || "weekly/dashboard"
				const content = expression.artifacts[id]
				return new Response(content ?? "", {
					headers: { "content-type": "text/plain" },
				})
			}
			if (url.pathname === "/tools/start_experience_setup") {
				const payload = {} // await req.json().catch(() => ({}))
				const result = await start_experience_setup(
					payload,
					"../life-os/life-os-rebuilt"
				)
				return new Response(JSON.stringify(result, null, 2), {
					headers: { "content-type": "application/json" },
				})
			}

			// 🧠 MCP server
			if (url.pathname === "/mcp") {
				ctx.props.baseUrl = url.origin

				return PurpleDreamsMCP.serve("/mcp", {
					binding: "PURPLEDREAMS_MCP_OBJECT",
				}).fetch(request, env, ctx)
			}

			// 🧪 Widget preview
			if (pathname.startsWith("/__dev/widgets")) {
				const htmlString = await getResourceRenderToString({
					resourcePath: "/widgets/calculator.js",
					baseUrl: url.origin,
				})
				return new Response(htmlString, {
					headers: { "Content-Type": "text/html" },
				})
			}

			// 📦 Static assets
			if (env.ASSETS) {
				const resp = await env.ASSETS.fetch(request)
				if (resp.ok) return resp
			}

			return new Response("Not Found", { status: 404 })
		},
	}),
}
