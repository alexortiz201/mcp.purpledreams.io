// TODO investigate way to best integration test my mcp server

console.info("[setup.silence-mcp] catching missing agents errors")

const shouldSilence = (reason: unknown) => {
	const msg = String((reason as any)?.message ?? reason ?? "")

	return (
		msg.includes("Agent was not found in send") ||
		msg.includes("Stream was cancelled")
	)
}

// Worker-style global handlers (Cloudflare workers pool)
addEventListener("unhandledrejection", (ev: PromiseRejectionEvent) => {
	if (shouldSilence(ev.reason)) {
		console.info({ ev })
		ev.preventDefault?.()
	}
})

// addEventListener("error", (ev: ErrorEvent) => {
// 	const msg = ev?.message ?? (ev as any)?.error?.message
// 	if (msg && shouldSilence({ message: msg })) {
// 		console.info({ ev })
// 		ev.preventDefault?.()
// 	}
// })

// Node fallback (if a test accidentally runs in node env)
// if (typeof process !== "undefined" && typeof process.on === "function") {
// 	process.on("unhandledRejection", (reason) => {
// 		if (shouldSilence(reason)) return
// 		// rethrow real problems
// 		throw reason as any
// 	})
// }
