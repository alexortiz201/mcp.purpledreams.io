import type { RouteHandlers } from "@remix-run/fetch-router"
import { handleOAuthAuthorizationServerRequest } from "../../auth"
import { withCorsMiddleware } from "../middleware/cors"
import type { baseAPI } from "../routes"

export default {
	use: [withCorsMiddleware],
	handlers: {
		healthcheck: {
			async index() {
				return new Response("ok")
			},
		},
		".well-known/oauth-authorization-server": {
			async index() {
				return handleOAuthAuthorizationServerRequest()
			},
		},
	} satisfies RouteHandlers<typeof baseAPI.system>,
}
