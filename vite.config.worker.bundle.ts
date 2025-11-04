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
		target: "es2022",
		lib: {
			entry: "worker/index.tsx",
			formats: ["es"],
			fileName: () => "worker.mjs",
		},
		rolldownOptions: {
			// ✅ Leave Workers virtual modules unresolved for workerd to handle
			external: [/^cloudflare:/],
			// optional: keep everything in a single file
			output: { inlineDynamicImports: true },
			// optional: quiet the “unresolved import” warnings if they bug you
			onwarn(warning, defaultHandler) {
				if (
					warning.code === "UNRESOLVED_IMPORT" &&
					typeof warning.cause === "string" &&
					warning.cause.startsWith("cloudflare:")
				) {
					return
				}
				defaultHandler(warning)
			},
		},
		// treeshake: true,
	},
})
