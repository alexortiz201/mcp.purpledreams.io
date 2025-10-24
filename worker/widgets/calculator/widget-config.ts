import { z } from "zod"
import { getResourceRenderToString } from "../utils/utils-mcp-ui"

export const widgetConfig = {
	name: "calculator",
	title: "Calculator",
	description: "A simple calculator",
	invokingMessage: `Getting your calculator ready`,
	invokedMessage: `Here's your calculator`,
	resultMessage: "The calculator has been rendered",
	widgetAccessible: true,
	resultCanProduceWidget: true,
	getHtml: (baseUrl: string) =>
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
	getStructuredContent: async (args: {
		display?: string
		previousValue?: number
		operation?: "+" | "-" | "*" | "/"
		waitingForNewValue?: boolean
		errorState?: boolean
	}) => args,
}
