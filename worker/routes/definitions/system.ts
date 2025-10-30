import type { RouteHandlers } from "@remix-run/fetch-router"
import type { baseAPI } from "../routes.ts"

export default {
	use: [], // [addContextToStorage] Example middleware
	handlers: {
		health: {
			async index() {
				return new Response("ok")
			},
		},
	} satisfies RouteHandlers<typeof baseAPI.system>,
}
