import { route } from "@remix-run/fetch-router"
import lifeOs from "./definitions/life-os.ts"
import mcp from "./definitions/mcp.ts"
import schedule from "./definitions/schedule.ts"
import system from "./definitions/system.ts"
import widgets from "./definitions/widgets.ts"

export const handlers = {
	system,
	widgets,
	mcp,
	schedule,
	"life-os": lifeOs,
}

export const baseAPI = route("/", {
	system: {
		health: {
			index: { method: "GET", pattern: "/health" },
		},
	},
	// 🧪 Widget preview
	widgets: {
		index: { method: "GET", pattern: "/__dev/widgets" },
	},
	// 🧠 MCP server
	mcp: {
		index: { method: "GET", pattern: "/mcp" },
		action: { method: "POST", pattern: "/mcp" },
	},
	// handle splat: 404
	// new Response("Not Found", { status: 404 })
})

export const routesAPI = route("/api", {
	schedule: {
		index: { method: "GET", pattern: "/schedule" },
		save: { method: "POST", pattern: "/schedule" },
		generate: { method: "POST", pattern: "/schedule/generate" },
	},
})

export const lifeOSAPI = route("/life-os", {
	"life-os": {
		health: { method: "GET", pattern: "/health" },
		expression: { method: "GET", pattern: "/expression" },
		artifact: { method: "GET", pattern: "/artifact" },
	},
})

export const routes = {
	...baseAPI,
	// ...routesAPI,
	// ...lifeOSAPI,
}
