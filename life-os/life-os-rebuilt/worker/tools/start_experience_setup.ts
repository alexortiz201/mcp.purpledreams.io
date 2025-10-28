// worker/tools/start_experience_setup.ts
// TypeScript ESM-safe runner — supports both import & CLI use.
// - Does NOT auto-run when imported (fixes wrangler/vite import side-effects)
// - Resolves LIFE_OS_DIR robustly
// - Reads JSON from stdin in CLI mode

import { exec } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

function run(cmd: string, cwd: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(cmd, { cwd }, (err, stdout, stderr) => {
			if (err) return reject(new Error(stderr || String(err)))
			resolve(stdout ?? "")
		})
	})
}

async function readStdinJSON<T = any>(): Promise<T | {}> {
	const chunks: Buffer[] = []
	for await (const c of process.stdin) chunks.push(c as Buffer)
	const raw = Buffer.concat(chunks).toString("utf8").trim()
	if (!raw) return {}
	try {
		return JSON.parse(raw) as T
	} catch (e: any) {
		throw new Error("Invalid JSON payload on stdin: " + e.message)
	}
}

// Try to derive __dirname; fall back to CWD if bundler/loader masks import.meta.url
function safeDirname(): string {
	try {
		// Some loaders give a proper file URL string
		// @ts-expect-error
		const href: string | undefined =
			typeof import.meta !== "undefined" ? (import.meta as any).url : undefined
		if (href) return path.dirname(fileURLToPath(href))
	} catch {}
	return process.cwd()
}

// ────────────────────────────────────────────────────────────────
export async function start_experience_setup(
	payload: any,
	LIFE_OS_DIR: string
) {
	const userId = String(payload.userId || "default")
	const userRoot = path.join(LIFE_OS_DIR, "runtime", userId)
	const tokensPath = path.join(userRoot, "tokens.json")
	const outDir = path.join(userRoot, "dist", "expression")

	await fs.mkdir(userRoot, { recursive: true })

	const name = payload.persona?.name || "Explorer"
	const category = payload.seedCategory || "health"
	const theme = payload.theme || "neutral"

	const goalByCategory: Record<string, string> = {
		health: "Recovery",
		wealth: "Ship Life-OS MVP",
		love: "Weekly Family Dinner",
		evolution: "Mastery in TypeScript",
	}
	const goalTitle =
		payload.goalTitle || goalByCategory[category] || "Personal Mastery"

	const tokens = {
		persona: {
			user: { name, archetype: payload.persona?.archetype || "Seeker" },
			ai: { theme },
		},
		vision: {
			one_year:
				payload.vision?.one_year ||
				"Live intentionally with balance and focus.",
			ninety_days:
				payload.vision?.ninety_days ||
				"Establish core habits and ship meaningful work.",
		},
		categories: { [category]: [goalTitle] },
		goals: {
			[goalTitle]: {
				id: goalTitle.toLowerCase().replace(/\s+/g, "-"),
				title: goalTitle,
				status: "active",
			},
		},
		tasks: {
			daily: payload.tasks?.daily || ["Journal", "Review Previous Day"],
			goalScoped: {
				[goalTitle]: {
					main: payload.tasks?.main || ["Gym Routine", "Write Compiler"],
					side: payload.tasks?.side || ["Stretch Series", "Design Schema"],
				},
			},
		},
		nudging: payload.nudging || {
			dailyPrompts: false,
			preferredTimes: ["09:00"],
		},
		theme: { style: theme },
		references: { consumedIds: [], items: [] },
	}

	await fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2))

	const buildCmd = `node rna/scripts/build-expression.mjs --tokens ${JSON.stringify(
		tokensPath
	)} --outdir ${JSON.stringify(outDir)}`
	const stdout = await run(buildCmd, LIFE_OS_DIR)
	if (stdout?.trim()) console.log(stdout.trim())

	const modPath = path.join(outDir, "index.js")
	const expression = (await import(pathToFileURL(modPath).href)).expression

	return {
		ok: true,
		userId,
		message: `Life-OS instance initialized for ${name}`,
		stats: { artifacts: Object.keys(expression.artifacts).length },
		sampleIds: Object.keys(expression.artifacts).slice(0, 5),
		outDir,
	}
}

// ────────────────────────────────────────────────────────────────
// CLI Entrypoint (guarded)
// ────────────────────────────────────────────────────────────────

async function resolveLifeOsDir(fromDir: string): Promise<string> {
	const CANDIDATE_ENV = process.env.LIFE_OS_DIR
	const CANDIDATES = [
		CANDIDATE_ENV,
		path.resolve(fromDir, "../../life-os/life-os-rebuilt"),
		path.resolve(fromDir, "../life-os/life-os-rebuilt"),
		path.resolve(fromDir, "../../life-os-rebuilt"),
		path.resolve(process.cwd(), "life-os/life-os-rebuilt"),
		path.resolve(process.cwd(), "life-os-rebuilt"),
		path.resolve(process.cwd()),
	].filter(Boolean) as string[]

	for (const p of CANDIDATES) {
		try {
			const st = await fs.stat(p)
			if (st.isDirectory()) return p
		} catch {}
	}
	throw new Error(
		"[life-os] Could not locate life-os-rebuilt.\nChecked:\n" +
			CANDIDATES.map((p) => ` - ${p}`).join("\n") +
			"\nTip: set LIFE_OS_DIR=/absolute/path/to/life-os/life-os-rebuilt"
	)
}

async function main() {
	// verbose logs help under loaders
	console.log("[life-os] start_experience_setup.ts starting...")

	const here = safeDirname()
	const LIFE_OS_DIR = await resolveLifeOsDir(here)
	console.log("[life-os] Using LIFE_OS_DIR =", LIFE_OS_DIR)

	const payload = await readStdinJSON<any>()
	console.log("[life-os] payload keys:", Object.keys(payload || {}))

	const result = await start_experience_setup(payload, LIFE_OS_DIR)
	console.log(JSON.stringify(result, null, 2))
}

// Only run when executed as a CLI (not when imported by the Worker)
// Some loaders don’t populate process.argv[1]; guard carefully.
let isCLI = false
try {
	const argv1 = process.argv?.[1]
	if (argv1) {
		isCLI = pathToFileURL(argv1).href === (import.meta as any).url
	}
} catch {
	// ignore — default is false
}

if (isCLI) {
	main().catch((err) => {
		console.error("[life-os] setup failed:", err)
		process.exit(1)
	})
}
