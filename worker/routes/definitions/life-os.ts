import expression from "@life-os/life-os/expression"
import type { RouteHandlers } from "@remix-run/fetch-router"
// import { D1Store } from "../../life-os/store/adapters/d1-store"
// import { ENV_KEY } from "./middleware/inject-context.ts"
import type { lifeOSAPI } from "../routes.ts"

export default {
	// use: [addContextToStorage], // Example middleware
	handlers: {
		async health() {
			return new Response("Life-OS online ✅", { status: 200 })
		},
		async expression() {
			return new Response(JSON.stringify(expression), {
				headers: { "content-type": "application/json" },
			})
		},
		async artifact({ params }) {
			const id = params?.id || "weekly/dashboard"
			const content = expression.artifacts[id]
			return new Response(content ?? "", {
				headers: {
					"content-type": "text/plain",
					"x-life-os-artifact-id": id,
				},
			})
		},
	} satisfies RouteHandlers<(typeof lifeOSAPI)["life-os"]>,
}
