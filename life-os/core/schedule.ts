import type { Schedule, TimeBlock } from "../models/lifeos"

export function generateSchedule(week: string): Schedule {
	const guidance = `
**Weekly Focus:** MCP Arc

- Ship one micro-feature (≤90m)
- Light mobility after soccer
- 15-min interview refresh Tue/Thu`
	const blocks: TimeBlock[] = [
		{ id: "a", label: "Morning System Check", start: "07:00", end: "07:45" },
		{
			id: "b",
			label: "Deep Work",
			start: "09:00",
			end: "12:00",
			arc: "MCP Arc",
		},
		{ id: "c", label: "Movement", start: "12:00", end: "12:30" },
		{
			id: "d",
			label: "Deep Work",
			start: "13:00",
			end: "14:45",
			arc: "MCP Arc",
		},
		{ id: "e", label: "Family", start: "15:00", end: "17:30" },
	]
	return { week, guidance, blocks }
}
