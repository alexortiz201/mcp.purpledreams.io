export type ArtifactTarget = "weekly" | "daily" | "project" | "task" | "system"

export interface SchemaVersion {
	contract: string
}

export interface ThemeManifest {
	name: string
	version: string
	schema: SchemaVersion
	targets: ArtifactTarget[]
	tokens?: Record<string, unknown>
	templates?: Record<string, string>
	assets?: Record<string, string>
	priority?: number
}

export interface ExpressionBundle {
	version: string
	builtAt: string
	artifacts: Record<string, string>
	sources: { theme?: string[]; dnaVersion: string; rnaVersion: string }
}

export interface DnaBundle {
	version: string
	schema: SchemaVersion
	ontology: Record<string, unknown>
	templates: Record<string, string>
}

export interface CompilePlan {
	targets: ArtifactTarget[]
	themeLayers: ThemeManifest[]
}

export interface ExpressionBundle {
	version: string
	builtAt: string
	artifacts: Record<string, string>
	sources: {
		theme?: string[]
		dnaVersion: string
		rnaVersion: string
	}
}

// DNA
const schema: SchemaVersion = { contract: "1.0.0" }

const templates: Record<string, string> = {
	"weekly.dashboard":
		"# Weekly Dashboard\n\n- Goals\n- Progress\n- Next Actions",
	"daily.journal": "# Daily Journal\n\n- Wins\n- Lessons\n- Focus",
}

const ontology = {
	entities: ["goal", "project", "task"],
	taxonomy: { goals: ["health", "wealth", "love", "evolution"] },
}

export function loadDNA(): DnaBundle {
	return {
		version: "0.1.0",
		schema,
		ontology,
		templates,
	}
}

// RNA
function resolveArtifacts(
	dna: DnaBundle,
	themes: ThemeManifest[]
): Record<string, string> {
	const sorted = [...themes].sort(
		(a, b) => (b.priority ?? 0) - (a.priority ?? 0)
	)
	const result: Record<string, string> = {}
	const keys = new Set(Object.keys(dna.templates))
	for (const t of sorted)
		for (const k of Object.keys(t.templates || {})) keys.add(k)
	for (const key of keys) {
		let content: string | undefined
		for (const t of sorted) {
			const hit = t.templates?.[key]
			if (hit) {
				content = hit
				break
			}
		}
		result[key] =
			content ?? dna.templates[key] ?? `<!-- missing template: ${key} -->`
	}
	return result
}

export function compile(dna: DnaBundle, plan: CompilePlan): ExpressionBundle {
	const artifacts = resolveArtifacts(dna, plan.themeLayers)
	return {
		version: "0.1.0",
		builtAt: new Date().toISOString(),
		artifacts,
		sources: {
			theme: plan.themeLayers.map((t) => t.name),
			dnaVersion: dna.version,
			rnaVersion: "0.1.0",
		},
	}
}

// THEME
export const themeDefault: ThemeManifest = {
	name: "@life-os/theme-default",
	version: "0.1.0",
	schema: { contract: "1.0.0" },
	targets: ["weekly", "daily", "project", "task", "system"],
	priority: 10,
	tokens: { radius: 12 },
	templates: {
		"weekly.dashboard":
			"# Weekly Dashboard (Default Theme)\n\n- Styled blocks\n- Progress bars\n- Highlights",
		"daily.journal":
			"# Daily Journal (Default Theme)\n\n- Mood\n- Focus\n- Gratitude",
	},
	assets: {},
}
