import { createStorageKey, type Middleware } from "@remix-run/fetch-router"
import type { Props } from "../../mcp"
import { takeRequestMeta } from "../../utils/utils-requests"

export const ENV_KEY = createStorageKey<Env>()
export const CTX_KEY = createStorageKey<ExecutionContext<Props>>()

export const injectContext: Middleware = (context, next) => {
	const meta = takeRequestMeta(context.request)

	if (meta) {
		context.storage.set(ENV_KEY, meta.env)
		context.storage.set(CTX_KEY, meta.ctx)
	}

	return next()
}
