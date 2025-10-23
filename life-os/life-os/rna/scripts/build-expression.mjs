import { constants } from "node:fs"
import { access, mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { pathToFileURL } from "node:url"

const root = resolve(process.cwd())
const distRna = resolve(root, "dist/rna/index.js")
const distVal = resolve(root, "dist/rna/validation.js") // <-- Zod lives in RNA
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
async function ensureCompiledRNA() {
	if ((await exists(distRna)) && (await exists(distVal))) return
	const { spawn } = await import("node:child_process")
	await new Promise((res, rej) => {
		const ps = spawn("npm", ["run", "build:ts"], {
			cwd: root,
			stdio: "inherit",
			shell: process.platform === "win32",
		})
		ps.on("exit", (code) =>
			code === 0 ? res() : rej(new Error(`ts build failed (${code})`))
		)
	})
	if (!(await exists(distRna)) || !(await exists(distVal))) {
		throw new Error(
			`[life-os] expected compiled RNA at:\n - ${distRna}\n - ${distVal}`
		)
	}
}

async function loadThemeFromEnv() {
	const spec = process.env.LIFE_OS_THEME || process.env.LIFE_OS_THEME_PATH
	if (!spec) return null
	try {
		const mod =
			spec.startsWith(".") || spec.startsWith("/")
				? await import(pathToFileURL(resolve(root, spec)).href)
				: await import(spec)
		return mod.default ?? mod.theme ?? mod
	} catch (e) {
		console.warn(`[life-os] could not load theme '${spec}': ${e.message}`)
		return null
	}
}

function formatZodErr(e) {
	return (e?.errors ?? [])
		.map((err) => {
			const path = err.path?.length ? err.path.join(".") : "(root)"
			return ` - ${path}: ${err.message}`
		})
		.join("\n")
}

async function main() {
	await ensureCompiledRNA()

	const themeCandidate = await loadThemeFromEnv()

	// Validate with RNA-owned Zod schema
	const { parseTheme } = await import(pathToFileURL(distVal).href)
	let themeLayers = []
	if (themeCandidate) {
		try {
			const theme = parseTheme(themeCandidate)
			themeLayers = [theme]
		} catch (e) {
			console.error(
				"[life-os] theme manifest failed validation:\n" + formatZodErr(e)
			)
			if (process.env.LIFE_OS_THEME_ALLOW_UNSAFE === "1") {
				console.warn(
					"[life-os] continuing despite validation errors (ALLOW_UNSAFE=1)."
				)
				themeLayers = [themeCandidate]
			} else {
				process.exit(1)
			}
		}
	}

	// Compile DNA -> Expression with RNA
	const { buildExpressionRuntime } = await import(pathToFileURL(distRna).href)
	const bundle = await buildExpressionRuntime({
		targets: ["weekly", "daily", "project", "task", "system"],
		themeLayers,
	})

	await mkdir(dirname(outJs), { recursive: true })
	await writeFile(
		outJs,
		`export const expression = ${JSON.stringify(bundle, null, 2)};\nexport default expression;\n`
	)
	await writeFile(
		outDts,
		`export interface ExpressionBundle {
  version: string; builtAt: string;
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
