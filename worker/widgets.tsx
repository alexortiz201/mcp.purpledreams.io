import { type CreateUIResourceOptions, createUIResource } from "@mcp-ui/server"
import type { ZodRawShape } from "zod"
import { BUILD_TIMESTAMP } from "./build-timestamp.ts"
import type { PurpleDreamsMCP } from "./mcp.tsx"
import { getWidgetConfigs, type Widget } from "./widgets/index"

const version = BUILD_TIMESTAMP

function createWidget<Input extends ZodRawShape, Output extends ZodRawShape>(
	widget: Widget<Input, Output>
): Widget<Input, Output> {
	return widget
}

export async function registerWidgets(agent: PurpleDreamsMCP) {
	const baseUrl = agent.requireDomain()
	const widgets = getWidgetConfigs().map(createWidget)

	for (const widget of widgets) {
		const name = `${widget.name}-${version}`
		const uri = `ui://widget/${name}.html` as `ui://${string}`

		const resourceInfo: CreateUIResourceOptions = {
			uri,
			encoding: "text",
			content: {
				type: "rawHtml",
				htmlString: await widget.getHtml(baseUrl),
			},
		}

		agent.server.registerResource(name, uri, {}, async () => ({
			contents: [
				createUIResource({
					...resourceInfo,
					metadata: {
						"openai/widgetDescription": widget.description,
						"openai/widgetCSP": {
							connect_domains: [],
							resource_domains: [baseUrl],
						},
						...(widget.widgetPrefersBorder
							? { "openai/widgetPrefersBorder": true }
							: {}),
					},
					adapters: {
						appsSdk: {
							enabled: true,
						},
					},
				}).resource,
			],
		}))

		agent.server.registerTool(
			name,
			{
				title: widget.title,
				description: widget.description,
				_meta: {
					"openai/widgetDomain": baseUrl,
					"openai/outputTemplate": uri,
					"openai/toolInvocation/invoking": widget.invokingMessage,
					"openai/toolInvocation/invoked": widget.invokedMessage,
					...(widget.resultCanProduceWidget
						? { "openai/resultCanProduceWidget": true }
						: {}),
					...(widget.widgetAccessible
						? { "openai/widgetAccessible": true }
						: {}),
				},
				inputSchema: widget.inputSchema,
				outputSchema: widget.outputSchema,
			},
			async (args) => {
				const structuredContent = widget.getStructuredContent
					? await widget.getStructuredContent(args)
					: {}
				return {
					content: [
						{ type: "text", text: widget.resultMessage },
						createUIResource({
							...resourceInfo,
							uiMetadata: {
								"initial-render-data": structuredContent,
							},
						}),
					],
					structuredContent,
				}
			}
		)
	}
}
