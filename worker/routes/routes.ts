import { route } from "@remix-run/fetch-router"

export const routes = route("/api", {
	schedule: {
		index: { method: "GET", pattern: "/schedule" },
		save: { method: "POST", pattern: "/schedule" },
		generate: { method: "POST", pattern: "/schedule/generate" },
	},
})
