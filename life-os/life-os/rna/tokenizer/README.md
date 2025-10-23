### Tokenizing example

```typescript
// life-os-rna (pseudo example)
import { TokenBase, fillTokens, type TokenPayload } from "./tokens_schema"
import fs from "node:fs/promises"

async function render(templatePath: string, data: TokenPayload) {
  const tokens = fillTokens(TokenBase.parse(data))
  let tpl = await fs.readFile(templatePath, "utf-8")

  // super simple replace — your real compiler can stream/AST/etc.
  return tpl.replace(/\{\{([a-z0-9_]+)\}\}/gi, (_, key) => String((tokens as any)[key]))
}

// Example
const md = await render(
  "life-os-dna/templates/tasks/main.md",
  {
    goal_label: "Wealth",
    project_label: "MCP",
    task_title: "Ship schedule API v1",
    xp_task_type: "main",
    phase_key: "momentum",
    phase_label: "Momentum",
    phase_multiplier: 1.2
  }
)
// => save to life-os-expression/Wealth/MCP/...
```