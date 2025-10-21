import { route } from "@remix-run/fetch-router"

export const routes = route("/api", {
	schedule: {
		hello: { method: "GET", pattern: "/hello" },
		index: { method: "GET", pattern: "/schedule" },
		save: { method: "POST", pattern: "/schedule" },
		generate: { method: "POST", pattern: "/schedule/generate" },
	},
})
