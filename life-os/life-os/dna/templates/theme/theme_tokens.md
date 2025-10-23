# Theme Tokens – Authoring Guide

Use tokens to keep templates minimal and let Life-OS/RNA apply styling:

```jsonc
{
  "color": {
    "primary": "#6b5cff",
    "surface": "#0b0b10",
    "accent": "#ffd166"
  },
  "radius": 12,
  "typography": {
    "headingScale": [36, 28, 22, 18, 16],
    "bodySize": 16
  }
}
```

**Best practices**
- Prefer semantic names: `surface`, `onSurface`, `accent`, `muted`.
- Keep units consistent (px or rem) when numbers are consumed downstream.
- Don’t hard-code tokens in templates; pass them as variables if needed.
