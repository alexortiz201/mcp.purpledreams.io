import type { Schedule } from "../types/lifeos"

export function markdownFromSchedule(s: Schedule) {
	const lines = [
		`# 🗓️ Weekly Plan — ${s.week}`,
		"",
		"## 🧭 Guidance",
		s.guidance,
		"",
		"## ⏱️ Time Blocks",
		...s.blocks.map(
			(b) => `- **${b.label}** ${b.start}–${b.end}${b.arc ? ` • ${b.arc}` : ""}`
		),
		"",
	]
	return lines.join("\n")
}
