import { type CreateUIResourceOptions, createUIResource } from "@mcp-ui/server"
import { type ZodRawShape, z } from "zod"
import { BUILD_TIMESTAMP } from "./build-timestamp.ts"
import type { PurpleDreamsMCP } from "./index.tsx"
import { getResourceRenderToString } from "./widgets/utils/utils-mcp-ui.tsx"

const version = BUILD_TIMESTAMP

type WidgetOutput<Input extends ZodRawShape, Output extends ZodRawShape> = {
	inputSchema: Input
	outputSchema: Output
	getStructuredContent: (
		args: {
			[Key in keyof Input]?: z.infer<Input[Key]>
		}
	) => Promise<{
		[Key in keyof Output]?: z.infer<Output[Key]>
	}>
}

type Widget<Input extends ZodRawShape, Output extends ZodRawShape> = {
	name: string
	title: string
	resultMessage: string
	description?: string
	invokingMessage?: string
	invokedMessage?: string
	widgetAccessible?: boolean
	widgetPrefersBorder?: boolean
	resultCanProduceWidget?: boolean
	getHtml: () => Promise<string>
} & WidgetOutput<Input, Output>

function createWidget<Input extends ZodRawShape, Output extends ZodRawShape>(
	widget: Widget<Input, Output>
): Widget<Input, Output> {
	return widget
}

export async function registerWidgets(agent: PurpleDreamsMCP) {
	const baseUrl = agent.requireDomain()
	const widgets = [
		createWidget({
			name: "calculator",
			title: "Calculator",
			description: "A simple calculator",
			invokingMessage: `Getting your calculator ready`,
			invokedMessage: `Here's your calculator`,
			resultMessage: "The calculator has been rendered",
			widgetAccessible: true,
			resultCanProduceWidget: true,
			getHtml: () =>
				getResourceRenderToString({
					resourcePath: "/widgets/calculator.js",
					baseUrl,
				}),
			inputSchema: {
				display: z
					.string()
					.optional()
					.describe("The initial current display value on the calculator"),
				previousValue: z
					.number()
					.optional()
					.describe(
						'The initial previous value on the calculator. For example, if the user says "I want to add 5 to a number" set this to 5'
					),
				operation: z
					.enum(["+", "-", "*", "/"])
					.optional()
					.describe(
						'The initial operation on the calculator. For example, if the user says "I want to add 5 to a number" set this to "+"'
					),
				waitingForNewValue: z
					.boolean()
					.optional()
					.describe(
						'Whether the calculator is waiting for a new value. For example, if the user says "I want to add 5 to a number" set this to true. If they say "subtract 3 from 4" set this to false.'
					),
				errorState: z
					.boolean()
					.optional()
					.describe("Whether the calculator is in an error state"),
			},
			outputSchema: {
				display: z.string().optional(),
				previousValue: z.number().optional(),
				operation: z.enum(["+", "-", "*", "/"]).optional(),
				waitingForNewValue: z.boolean().optional(),
				errorState: z.boolean().optional(),
			},
			getStructuredContent: async (args) => args,
		}),
	]

	for (const widget of widgets) {
		const name = `${widget.name}-${version}`
		const uri = `ui://widget/${name}.html` as `ui://${string}`

		const resourceInfo: CreateUIResourceOptions = {
			uri,
			encoding: "text",
			content: {
				type: "rawHtml",
				htmlString: await widget.getHtml(),
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
