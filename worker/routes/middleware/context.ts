import type { Middleware } from "@remix-run/fetch-router"

import { requestContextStorage } from "../../utils/utils-route-context"

/**
 * Middleware that stores the RequestContext in AsyncLocalStorage.
 * This should be the first middleware in your application so that
 * the context is available to all subsequent middleware and handlers.
 */
export const storeContext: Middleware = (context, next) => {
	return requestContextStorage.run(context, () => next())
}
