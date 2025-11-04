import { z } from "zod"
import { buildRenderedArtifacts } from "../expression.service"
import { answersToTokens, INTAKE } from "../intake.module"

export const StartExperienceInput = z
	.object({
		answers: z.record(z.any(), z.any()).optional(),
		targets: z.array(z.string()).optional(),
	})
	.optional()

export type StartExperienceInput = z.infer<typeof StartExperienceInput>

export async function startExperienceSetup(params?: StartExperienceInput) {
	if (!params || !params.answers) {
		return { type: "intake", module: INTAKE }
	}
	const tokens = answersToTokens(params.answers)
	const targets = params.targets ?? INTAKE.defaultTargets
	const { rendered, meta } = buildRenderedArtifacts({ tokens, targets })
	return { type: "artifacts", meta, artifacts: rendered }
}
