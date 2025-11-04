import { env } from "cloudflare:test"
import { describe, expect, it } from "vitest"

describe("bindings", () => {
	it("has DO and DB bindings", () => {
		expect(env).toHaveProperty("PURPLEDREAMS_MCP_OBJECT")
		expect(env).toHaveProperty("DB")

		// expect(env).toHaveProperty("ASSETS")
	})
})
