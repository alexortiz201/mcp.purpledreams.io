import expression from "@life-os/life-os/expression"
import type { ExpressionBundle } from "@life-os/life-os/types"

function get(obj: Record<string, unknown>, dotted: string) {
	return (
		(dotted.split(".").reduce((acc, k) => {
			if (acc && acc[k] !== undefined) return acc[k]
			return acc
		}, obj) as string) || undefined
	)
}

function interpolate(
	template: string,
	tokens: Record<string, unknown>
): string {
	return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
		const v = get(tokens, String(key).trim())
		return v == null ? "" : String(v)
	})
}

export type BuildRequest = {
	tokens?: Record<string, unknown>
	targets?: string[]
}

export function buildRenderedArtifacts(req: BuildRequest = {}) {
	const bundle: ExpressionBundle = expression
	const targets = req.targets ?? Object.keys(bundle.artifacts)
	const rendered: Record<string, string> = {}
	for (const id of targets) {
		const tpl = bundle.artifacts[id]
		if (!tpl) continue
		rendered[id] = req.tokens ? interpolate(tpl, req.tokens) : tpl
	}
	return {
		rendered,
		meta: {
			builtAt: bundle.builtAt,
			version: bundle.version,
			sources: bundle.sources,
		},
	}
}
