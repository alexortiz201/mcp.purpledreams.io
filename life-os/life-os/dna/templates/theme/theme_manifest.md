---
title: "Theme Manifest – Authoring Template"
about: "Copy this into your theme package and export it as the default manifest."
---

```ts
import type { ThemeManifest } from "@life-os/life-os/types";

const theme: ThemeManifest = {
  name: "@life-os/theme-my-theme",
  version: "0.1.0",
  schema: { contract: "1.0.0" },
  targets: ["weekly", "daily", "project", "task", "system"],
  priority: 10,
  tokens: {
    color: {
      primary: "#6b5cff",
      surface: "#0b0b10",
      accent: "#ffd166"
    },
    radius: 12,
    typography: { headingScale: [36, 28, 22, 18, 16], bodySize: 16 }
  },
  templates: {
    "weekly.dashboard": "# Weekly Dashboard — *My Theme*\n\n- Highlights\n- Progress\n- Next actions",
    "daily.journal":   "# Daily Journal — *My Theme*\n\n- Mood\n- Focus\n- Gratitude"
  },
  assets: {
    "logo.svg": "<svg><!-- ... --></svg>"
  }
};

export default theme;
```
