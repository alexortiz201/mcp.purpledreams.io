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

export type Widget<I extends ZodRawShape, O extends ZodRawShape> = {
	name: string
	title: string
	resultMessage: string
	description?: string
	invokingMessage?: string
	invokedMessage?: string
	widgetAccessible?: boolean
	widgetPrefersBorder?: boolean
	resultCanProduceWidget?: boolean

	getHtml: (baseUrl: string) => Promise<string> | string
} & WidgetOutput<I, O>

export function createWidget<I extends ZodRawShape, O extends ZodRawShape>(
	widget: Widget<I, O>
): Widget<I, O> {
	return widget
}

export const getWidgetConfigs = () => [calculaterWidgetConfig]
