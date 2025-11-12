import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config"

export default defineWorkersConfig({
	test: {
		globalSetup: "tests/setup.global.ts",
		include: ["tests/**/*.test.ts"],
		exclude: ["tests/mcp.worker.test.ts"],
		poolOptions: {
			isolatedStorage: false,
			singleWorker: true,
			workers: {
				// ✅ Pull bindings/env from wrangler.jsonc
				wrangler: { configPath: "./wrangler.jsonc" },
				// ✅ But actually run your pre-bundled worker
				// (this overrides wrangler.main)
				main: "./worker/index.ts",
				miniflare: {
					/* durableObjects: {
						NAME: "PurpleDreamsMCP",
					}, */
					compatibilityDate: "2025-10-11",
					commonjsCompat: true,
				},
			},
		},
	},
})
