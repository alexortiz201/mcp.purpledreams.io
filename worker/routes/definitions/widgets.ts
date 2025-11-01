import type { RouteHandlers } from "@remix-run/fetch-router"
import { withCorsMiddleware } from "../../utils/utils-requests.ts"
import { getResourceRenderToString } from "../../widgets/utils/utils-mcp-ui.tsx"
// import { D1Store } from "../../life-os/store/adapters/d1-store"
// import { ENV_KEY } from "./middleware/inject-context.ts"
import type { baseAPI } from "../routes.ts"
// CORS middleware for all API routes
// router.map(routes.api, [cors({ origin: "*" })], handlers)

export default {
	// currently, convention for remix/fetch-router is { user: [], handlers } || { handler }
	// not having a use exposed when exposing plural handlers causes a broken code path when
	// assesing isRouteHandlersWithMiddleware()
	use: [withCorsMiddleware],
	handlers: {
		async index({ url }) {
			const htmlString = await getResourceRenderToString({
				resourcePath: "/widgets/calculator.js",
				baseUrl: url.origin,
			})
			return new Response(htmlString, {
				headers: { "Content-Type": "text/html" },
			})
		},
	} satisfies RouteHandlers<typeof baseAPI.widgets>,
}
