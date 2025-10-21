import { createStorageKey, type Router } from "@remix-run/fetch-router"
import type { Props } from "../../mcp"
import { getStorage } from "../../utils/utils-route-context"

export const ENV_KEY = createStorageKey<Env>()
export const CTX_KEY = createStorageKey<ExecutionContext<Props>>()

export function addContextToStorage(env: Env, ctx: ExecutionContext<Props>) {
	const storage = getStorage()

	storage.set(ENV_KEY, env)
	storage.set(CTX_KEY, ctx)
}

export const createFetchWithContext =
	(router: Router) =>
	(request: Request, env: Env, ctx: ExecutionContext<Props>) => {
		addContextToStorage(env, ctx)
		return router.fetch(request)
	}
