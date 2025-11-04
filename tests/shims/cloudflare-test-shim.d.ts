declare module "cloudflare:test" {
	// Minimal shape that matches what you use in tests.
	// Add exports here as you need them.
	export const SELF: {
		fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
	}
	export const env: Record<string, unknown>
}
