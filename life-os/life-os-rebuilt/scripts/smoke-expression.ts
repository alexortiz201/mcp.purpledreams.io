import path from "node:path"
import { pathToFileURL } from "node:url"

const userId = process.argv[2] || "alex"
const outDir = path.resolve("runtime", userId, "dist/expression")

const mod = await import(pathToFileURL(path.join(outDir, "index.js")).href)
const exp = mod.expression

const mustHave = [
	"persona/sheet",
	"persona/ai-coach-profile",
	"daily/journal",
	"weekly/dashboard",
	"references/links.json",
]

const has = mustHave.every((k) => exp.artifacts[k] != null)

console.log("[check] artifact keys:", Object.keys(exp.artifacts).length)
console.log("[check] essentials ok?", has)

if (!has) {
	const missing = mustHave.filter((k) => !(k in exp.artifacts))
	console.error("Missing:", missing)
	process.exit(1)
} else {
	console.log("✅ Expression structure is valid")
}
