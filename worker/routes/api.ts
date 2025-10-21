// export const LOCALS_KEY = createStorageKey<{ userId: string }>()
// CORS middleware for all API routes
// router.map(routes.api, [cors({ origin: "*" })], handlers)

import { createRouter } from "@remix-run/fetch-router"
import { logger } from "@remix-run/fetch-router/logger-middleware"

import { createFetchWithContext } from "./adapters/utils-context-cloudflare.ts"
import { storeContext } from "./middleware/context"
import { scheduleRouter } from "./schedule"

const router = createRouter()
router.use(storeContext)

if (process.env.NODE_ENV === "development") router.use(logger())

router.mount("/schedule", scheduleRouter)

export const api = { fetch: createFetchWithContext(router) }
