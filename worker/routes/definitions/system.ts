import type { RouteHandlers } from "@remix-run/fetch-router"
import type { baseAPI } from "../routes"

export default {
	use: [], // [addContextToStorage] Example middleware
	handlers: {
		healthcheck: {
			async index() {
				return new Response("ok")
			},
		},
	} satisfies RouteHandlers<typeof baseAPI.system>,
}
