import type { ZodRawShape, z } from "zod"
import { widgetConfig as calculaterWidgetConfig } from "./calculator/widget-config"

export type WidgetOutput<
	Input extends ZodRawShape,
	Output extends ZodRawShape,
> = {
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

export type Widget<Input extends ZodRawShape, Output extends ZodRawShape> = {
	name: string
	title: string
	resultMessage: string
	description?: string
	invokingMessage?: string
	invokedMessage?: string
	widgetAccessible?: boolean
	widgetPrefersBorder?: boolean
	resultCanProduceWidget?: boolean
	getHtml: (baseUrl: string) => Promise<string>
} & WidgetOutput<Input, Output>

export const getWidgetConfigs = () => [calculaterWidgetConfig]
