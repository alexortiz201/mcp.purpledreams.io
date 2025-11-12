import { defineConfig } from "vite"

export default defineConfig({
	resolve: {
		alias: {
			"node:async_hooks": "/tests/shims/async_hooks-shim.mjs",
		},
	},
	build: {
		outDir: "dist-worker",
		emptyOutDir: true,
		sourcemap: "inline",
		minify: false,
		target: "es2025",
		lib: {
			// skipNodeModulesBundle: true,
			// external: ["cloudflare:workers", "cloudflare:email"],
			// format: "esm",
			// sourcemap: true
			entry: "worker/index.ts",
			formats: ["es"],
			fileName: () => "worker.mjs",
		},
		rolldownOptions: {
			// ✅ Leave Workers virtual modules unresolved for workerd to handle
			external: [/^cloudflare:/],
			// optional: keep everything in a single file
			output: { inlineDynamicImports: true },
		},
		// treeshake: true,
	},
})
