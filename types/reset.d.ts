import "@epic-web/config/reset.d.ts"

declare global {
	// biome-ignore lint/complexity/noBannedTypes: Look into this later
	interface CustomExportedHandler<Props = {}> {
		fetch: (
			request: Request,
			env: Env,
			ctx: ExecutionContext<Props>
		) => Response | Promise<Response>
	}
}
