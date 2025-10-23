// life-os/life-os/rna/scripts/build-expression.mjs

import { spawn } from "node:child_process"
import { constants } from "node:fs"
import { access, mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { pathToFileURL } from "node:url"

const root = resolve(process.cwd())
const distRna = resolve(root, "dist/rna/index.js")
const outJs = resolve(root, "dist/expression/index.js")
const outDts = resolve(root, "dist/expression/index.d.ts")

async function exists(p) {
	try {
		await access(p, constants.F_OK)
		return true
	} catch {
		return false
	}
}

function run(cmd, args, cwd = root) {
	return new Promise((resolve, reject) => {
		const ps = spawn(cmd, args, {
			cwd,
			stdio: "inherit",
			shell: process.platform === "win32",
		})
		ps.on("exit", (code) =>
			code === 0
				? resolve()
				: reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`))
		)
	})
}

async function ensureCompiledRNA() {
	if (await exists(distRna)) return
	console.log("[life-os] dist/rna/index.js not found — compiling TypeScript...")
	await run("npm", ["run", "build:ts"]) // requires "build:ts": "tsc -p tsconfig.json" in this package.json
	if (!(await exists(distRna))) {
		throw new Error(
			`[life-os] Still missing: ${distRna}. Check that rna/index.ts exists and tsconfig includes it.`
		)
	}
}

async function main() {
	await ensureCompiledRNA()

	const { buildExpressionRuntime } = await import(pathToFileURL(distRna).href)

	const bundle = await buildExpressionRuntime({
		targets: ["weekly", "daily", "project", "task", "system"],
		// themeLayers: [...]
	})

	await mkdir(dirname(outJs), { recursive: true })
	await writeFile(
		outJs,
		`export const expression = ${JSON.stringify(bundle, null, 2)};\nexport default expression;\n`
	)

	await writeFile(
		outDts,
		`export interface ExpressionBundle {
  version: string;
  builtAt: string;
  artifacts: Record<string, string>;
  sources: { theme?: string[]; dnaVersion: string; rnaVersion: string; };
}
export declare const expression: ExpressionBundle;
export default expression;
`
	)

	console.log("[life-os] expression bundle generated at", outJs)
}

main().catch((e) => {
	console.error("[life-os] expression build failed:", e)
	process.exit(1)
})
