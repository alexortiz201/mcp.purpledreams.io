import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config"

export default defineWorkersConfig({
	test: {
		poolOptions: {
			isolatedStorage: true,
			workers: {
				// ✅ Pull bindings/env from wrangler.jsonc
				wrangler: { configPath: "./wrangler.jsonc" },
				// ✅ But actually run your pre-bundled worker
				// (this overrides wrangler.main)
				main: "./dist-worker/worker.mjs",
				miniflare: {
					compatibilityDate: "2025-10-11",
					commonjsCompat: true,
				},
			},
		},
		include: ["tests/**/*.test.ts"],
		exclude: ["worker/index.test.ts"],
	},
})
