// export const LOCALS_KEY = createStorageKey<{ userId: string }>()
// CORS middleware for all API routes
// router.map(routes.api, [cors({ origin: "*" })], handlers)

import { createRouter } from "@remix-run/fetch-router"
import { logger } from "@remix-run/fetch-router/logger-middleware"

import { createFetchWithContext } from "./adapters/utils-context-cloudflare.ts"
import { storeContext } from "./middleware/context.ts"
import { routes } from "./routes.ts"
import schedule from "./schedule.ts"

const router = createRouter()
router.use(storeContext)

if (process.env.NODE_ENV === "development") router.use(logger())

router.map(routes.schedule, schedule.handlers)

export const api = { fetch: createFetchWithContext(router) }
