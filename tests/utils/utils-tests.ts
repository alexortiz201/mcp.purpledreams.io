import {
	Client,
	type ClientOptions,
} from "@modelcontextprotocol/sdk/client/index.js"

const CLIENT_OPTS_DEFAULT = {
	name: "MCPTester",
	version: "1.0.0",
}

export async function setupClient(clientOpts = CLIENT_OPTS_DEFAULT) {
	const client = new Client(clientOpts)
	const transport = new StdioClientTransport({
		command: "tsx",
		args: ["src/index.ts"],
	})

	try {
		await client.connect(transport)
	} catch (error: any) {
		console.error(
			"🚨 Connection failed! This exercise requires implementing the main function in src/index.ts"
		)
		console.error(
			"🚨 Replace the \"throw new Error('Not implemented')\" with the actual MCP server setup"
		)
		console.error(
			"🚨 You need to: 1) Create an EpicMeMCP instance, 2) Initialize it, 3) Connect to stdio transport"
		)
		console.error("Original error:", error.message || error)
		throw error
	}

	return {
		client,
		async [Symbol.asyncDispose]() {
			await client.transport?.close()
		},
	}
}
