// import { start_experience_setup } from "../life-os/life-os-rebuilt/worker/tools/start_experience_setup.ts"
import { PurpleDreamsMCP } from "./mcp.tsx"
import { handler } from "./routes/router.ts"
// import { getCorsHeaders, withCors } from "./utils/utils-requests.ts"

export { PurpleDreamsMCP }

export default {
	fetch: handler,
	// fetch: withCors({
	// 	getCorsHeaders,
	// 	handler,
	// }),
}
