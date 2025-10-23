import type {
	ArtifactTarget,
	ExpressionBundle,
	ThemeManifest,
} from "../types/index.js"
import { loadDNA } from "../types/index.js"

export type CompilePlan = {
	targets: ArtifactTarget[]
	themeLayers: ThemeManifest[]
}

function resolveArtifacts(
	dna: ReturnType<typeof loadDNA>,
	themes: ThemeManifest[]
): Record<string, string> {
	const sorted = [...themes].sort(
		(a, b) => (b.priority ?? 0) - (a.priority ?? 0)
	)
	const keys = new Set(Object.keys(dna.templates))
	for (const t of sorted)
		for (const k of Object.keys(t.templates || {})) keys.add(k)

	const out: Record<string, string> = {}
	for (const k of keys) {
		let hit: string | undefined
		for (const t of sorted) {
			const val = t.templates?.[k]
			if (val) {
				hit = val
				break
			}
		}
		out[k] = hit ?? dna.templates[k] ?? `<!-- missing template: ${k} -->`
	}
	return out
}

export async function buildExpressionRuntime(
	plan?: Partial<CompilePlan>
): Promise<ExpressionBundle> {
	const dna = loadDNA()
	// const targets = (plan?.targets ?? [
	// 	"weekly",
	// 	"daily",
	// 	"project",
	// 	"task",
	// 	"system",
	// ]) as ArtifactTarget[]
	const themeLayers = plan?.themeLayers ?? []
	const artifacts = resolveArtifacts(dna, themeLayers)
	return {
		version: "0.1.0",
		builtAt: new Date().toISOString(),
		artifacts,
		sources: {
			theme: themeLayers.map((t) => t.name),
			dnaVersion: dna.version,
			rnaVersion: "0.1.0",
		},
	}
}
