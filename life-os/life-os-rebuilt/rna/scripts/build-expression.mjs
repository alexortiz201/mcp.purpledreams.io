import path from "node:path"
import { ensureDir, readFile, writeFile } from "fs-extra"
import globby from "globby"
import { parse as parseJSONC } from "jsonc-parser"
import slugify from "slugify"

const ROOT = process.cwd()
const LIFE_OS = path.join(ROOT, "life-os-rebuilt")
const DNA_DIR = path.join(LIFE_OS, "dna")
const TPL_DIR = path.join(DNA_DIR, "templates")
const MOD_DIR = path.join(DNA_DIR, "core-system", "modules")
const OUT_JS = path.join(LIFE_OS, "dist", "expression", "index.js")
const OUT_DTS = path.join(LIFE_OS, "dist", "expression", "index.d.ts")
const TOKENS_CLI = process.argv.includes("--tokens")
	? process.argv[process.argv.indexOf("--tokens") + 1]
	: null

const readJSONC = async (p) => parseJSONC(await readFile(p, "utf8"))
const loadTokens = async () =>
	TOKENS_CLI ? JSON.parse(await readFile(TOKENS_CLI, "utf8")) : {}

// id -> example content
async function loadExamples() {
	const files = await globby("**/*.md", { cwd: TPL_DIR })
	const examples = {}
	for (const rel of files) {
		const id = rel.replace(/\\/g, "/").replace(/\.md$/, "")
		examples[id] = await readFile(path.join(TPL_DIR, rel), "utf8")
	}
	return examples
}

function findGoalCategory(tokens, goalTitle) {
	for (const [cat, list] of Object.entries(tokens.categories || {})) {
		if (Array.isArray(list) && list.includes(goalTitle)) return cat
	}
	return null
}

function stubFromExample(exampleId, examples, meta) {
	const hint = examples[exampleId] || ""
	const header = `<!-- AI: Construct this artifact using DNA example "${exampleId}". Do not copy verbatim; adapt to user tokens and psychology profile. -->
<!-- META: ${JSON.stringify(meta)} -->
`
	return header + "\n" + hint.trim() + "\n"
}

async function main() {
	await readJSONC(path.join(MOD_DIR, "synthesis.jsonc")) // reserved for future logic
	const examples = await loadExamples()
	const tokens = await loadTokens()

	const artifacts = {}

	// category-goals
	for (const [category, goalList] of Object.entries(tokens.categories || {})) {
		for (const goalTitle of goalList) {
			const goalSlug = slugify(goalTitle, { lower: true, strict: true })
			const id = `categories/${category}/goals/${goalSlug}/goal`
			artifacts[id] = stubFromExample("goals/goal", examples, {
				category,
				goalTitle,
				goalSlug,
			})
		}
	}

	// goal-scoped tasks
	const goalScoped = (tokens.tasks && tokens.tasks.goalScoped) || {}
	for (const [goalTitle, groups] of Object.entries(goalScoped)) {
		const category = findGoalCategory(tokens, goalTitle)
		if (!category) continue
		const goalSlug = slugify(goalTitle, { lower: true, strict: true })
		for (const [group, taskList] of Object.entries(groups || {})) {
			for (const taskTitle of taskList || []) {
				const taskSlug = slugify(taskTitle, { lower: true, strict: true })
				const id = `categories/${category}/goals/${goalSlug}/tasks/${group}/${taskSlug}`
				const exampleId = `tasks/${group}` // main or side
				artifacts[id] = stubFromExample(exampleId, examples, {
					category,
					goalTitle,
					goalSlug,
					group,
					taskTitle,
					taskSlug,
				})
			}
		}
	}

	// daily tasks
	for (const taskTitle of (tokens.tasks && tokens.tasks.daily) || []) {
		const taskSlug = slugify(taskTitle, { lower: true, strict: true })
		const id = `tasks/daily/${taskSlug}`
		artifacts[id] = stubFromExample("tasks/daily", examples, {
			taskTitle,
			taskSlug,
		})
	}

	// core artifacts
	artifacts["persona/sheet"] = stubFromExample(
		"core-system/character-sheet",
		examples,
		{}
	)
	artifacts["persona/ai-coach-profile"] = stubFromExample(
		"core-system/ai-coach-profile",
		examples,
		{}
	)
	artifacts["daily/journal"] = stubFromExample(
		"core-system/journal",
		examples,
		{}
	)
	artifacts["weekly/dashboard"] = stubFromExample(
		"core-system/weekly-dashboard",
		examples,
		{}
	)
	artifacts["learning/archive"] = stubFromExample(
		"core-system/learning-archive",
		examples,
		{}
	)
	artifacts["blockers/shadow"] = stubFromExample(
		"core-system/blockers-shadow",
		examples,
		{}
	)

	// references
	artifacts["references/links.json"] = JSON.stringify(
		{ consumedIds: [], items: [] },
		null,
		2
	)

	await ensureDir(path.dirname(OUT_JS))
	await writeFile(
		OUT_JS,
		`export const expression = ${JSON.stringify(
			{
				version: "0.1.0",
				builtAt: new Date().toISOString(),
				artifacts,
				sources: {
					theme: [],
					dnaVersion: "0.1.0",
					compiler: "example-stubber",
				},
			},
			null,
			2
		)};\nexport default expression;\n`
	)

	await writeFile(
		OUT_DTS,
		`export interface ExpressionBundle {
  version: string;
  builtAt: string;
  artifacts: Record<string,string>;
  sources: { theme: string[]; dnaVersion: string; compiler: string; };
}
declare const expression: ExpressionBundle;
export default expression;`
	)

	console.log("[life-os] expression stub bundle generated:", OUT_JS)
}

main().catch((e) => {
	console.error("[life-os] build failed", e)
	process.exit(1)
})
