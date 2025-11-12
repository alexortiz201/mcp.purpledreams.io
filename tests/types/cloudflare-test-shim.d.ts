declare module "cloudflare:test" {
	// ProvidedEnv controls the type of `import("cloudflare:test").env`
	interface ProvidedEnv extends Env {
		PURPLE_DREAMS_MCP_OBJECT: DurableObjectNamespace<McpAgent>
	}
}
