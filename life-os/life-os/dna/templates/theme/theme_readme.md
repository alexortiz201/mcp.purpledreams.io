# Life-OS Theme – Starter

## Install
```bash
pnpm add @life-os/life-os @life-os/theme-my-theme
```

## Export a manifest
```ts
import type { ThemeManifest } from "@life-os/life-os/types";
const theme: ThemeManifest = { /* …see theme_manifest.md… */ };
export default theme;
```

## Test locally (with an app that uses Life-OS)
```bash
# in your app (MCP server):
pnpm add @life-os/theme-my-theme
# build expression with theme (runtime or build-time depending on your setup)
```

**Contract compatibility**
- This theme targets `schema.contract = "1.0.0"`.
- Update when Life-OS bumps the theme contract.
