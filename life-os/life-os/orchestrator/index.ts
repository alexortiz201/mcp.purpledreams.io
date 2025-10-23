import {
	type ArtifactTarget,
	type CompilePlan,
	compile,
	type ExpressionBundle,
	loadDNA,
	type ThemeManifest,
} from "@life-os/life-os/types"

export type BuildOptions = {
	theme?: ThemeManifest | ThemeManifest[]
	targets?: string[]
	outDir?: string
	mode?: "dev" | "prod"
}

export async function buildExpression(
	opts: BuildOptions = {}
): Promise<ExpressionBundle> {
	const dna = loadDNA()
	const themeLayers = Array.isArray(opts.theme)
		? opts.theme
		: opts.theme
			? [opts.theme]
			: []
	const plan: CompilePlan = {
		targets: (opts.targets as ArtifactTarget[]) ?? [
			"weekly",
			"daily",
			"project",
			"task",
			"system",
		],
		themeLayers,
	}
	return compile(dna, plan)
}

// demo
export async function demo() {
	// const { default: themeDefault } = await import("@life-os/life-os/themes")
	const result = await buildExpression()
	console.log("Artifacts:", Object.keys(result.artifacts))
	return result
}
