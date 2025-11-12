import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config"

export default defineWorkersConfig({
	test: {
		/* deps: {
			optimizer: {
				ssr: {
					include: [
						// vitest can't seem to properly import
						// `require('./path/to/anything.json')` files,
						// which ajv uses (by way of @modelcontextprotocol/sdk)
						// the workaround is to add the package to the include list
						"ajv",
					],
				},
			},
		}, */
		setupFiles: ["tests/setup.agents.ts", "tests/setup.silence-mcp.ts"], // "tests/setup.global.ts",
		include: ["tests/mcp.worker.test.ts"], // ["tests/**/*.test.ts"]
		exclude: ["worker/index.test.ts"],
		poolOptions: {
			isolatedStorage: false,
			singleWorker: true,
			workers: {
				// ✅ Pull bindings/env from wrangler.jsonc
				wrangler: { configPath: "./wrangler.jsonc" },
				// ✅ But actually run your pre-bundled worker
				// (this overrides wrangler.main)
				main: "./dist-worker/worker.mjs",
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
