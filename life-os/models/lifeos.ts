import { z } from "zod"

export type ISOWeek = string

export const TimeBlockSchema = z.object({
	id: z.string(),
	label: z.string(),
	start: z.string(), // "09:00"
	end: z.string(), // "12:00"
	arc: z.string().optional(),
})
export type TimeBlock = z.infer<typeof TimeBlockSchema>

export const ScheduleSchema = z.object({
	week: z.string(), // e.g. "2025-W43"
	guidance: z.string(), // markdown
	blocks: z.array(TimeBlockSchema),
})
export type Schedule = z.infer<typeof ScheduleSchema>

export const SuggestionSchema = z.object({
	id: z.string().optional(),
	title: z.string(),
	url: z.string().url().optional(),
	tags: z.array(z.string()).optional(),
	reason: z.string().optional(),
	priority: z.number().optional(),
	createdAt: z.string().optional(),
})
export type Suggestion = z.infer<typeof SuggestionSchema>
