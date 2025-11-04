import { z } from "zod"

// --- Tokens (extensible) ---
export const ThemeTokensZ = z
	.object({
		color: z.record(z.string(), z.any()).optional(),
		radius: z.number().nonnegative().optional(),
		spacing: z.record(z.number(), z.any()).optional(),
		typography: z
			.object({
				fontFamily: z.string().optional(),
				headingScale: z.array(z.number()).optional(),
				bodySize: z.number().optional(),
			})
			.partial()
			.optional(),
	})
	.loose()

// --- Manifest ---
export const ThemeManifestZ = z
	.object({
		name: z.string().min(1),
		version: z.string().min(1),
		schema: z.object({
			contract: z.string().min(1), // e.g., "1.0.0"
		}),
		targets: z.array(z.enum(["weekly", "daily", "project", "task", "system"])),
		priority: z.number().optional(),
		tokens: ThemeTokensZ.optional(),
		templates: z.record(z.string(), z.any()).optional(), // { "weekly.dashboard": "..." }
		assets: z.record(z.string(), z.any()).optional(),
	})
	.strict()

export type ThemeManifestZod = z.infer<typeof ThemeManifestZ>
export type ThemeTokensZod = z.infer<typeof ThemeTokensZ>

export function parseTheme(obj: unknown): ThemeManifestZod {
	return ThemeManifestZ.parse(obj)
}
