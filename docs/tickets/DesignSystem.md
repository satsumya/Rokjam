## Colour system

Visual reference: `/color-system` (also linked from Scenario tester). Tokens live in `src/theme/colors.ts`.

### Brand & semantic palettes

Each brand and semantic colour has four shades — all defined as **explicit hex values** (not generated):

| Shade | Use |
| --- | --- |
| **main** | Primary swatch — climbing difficulty chips, key fills |
| **light** | Subtle backgrounds, hover states |
| **dark** | Emphasis, pressed states |
| **accent** | Borders and icons only — **no contrast token** |

Example tokens for `brand.green`:

- `brand.green.main`
- `brand.green.light`
- `brand.green.dark`
- `brand.green.accent`

Brand colours: yellow, blue, purple, green, orange, red, black, white, pink.

Semantic colours (same shade structure): negative, attention, positive, info, discovery.

### Contrast tokens

Contrast colours are **used on their related shade** — e.g. any text on `brand.yellow.main` should use `brand.yellow.main.contrast.alt` or `brand.yellow.main.contrast.tonal`.

Text-on-background pairs for accessible UI. All combinations must pass **WCAG AA**.

**On main** — two contrast options:

- `brand.green.main.contrast.alt` — explicit hex (typically neutral)
- `brand.green.main.contrast.tonal` — derived from that colour’s **dark** or **light** shade, optionally mixed toward `darkTarget` or `lightTarget` to improve contrast on main (see `mainContrast.tonal` in `BRAND_PALETTES`)

**On light and dark** — tonal contrast using the paired shade:

- `brand.green.light.contrast` — text on light = that colour’s **dark** shade
- `brand.green.dark.contrast` — text on dark = that colour’s **light** shade

**Accent has no contrast token** — use for borders and icons, not text.

Full example (`brand.green`):

```
brand.green.main
brand.green.main.contrast.alt
brand.green.main.contrast.tonal
brand.green.light
brand.green.light.contrast
brand.green.dark
brand.green.dark.contrast
brand.green.accent
```

Apply the same pattern to semantic colours (e.g. `semantic.positive.main.contrast.alt`).

### Neutral

- [ ] Sandy/beige neutral scale — 10 shades from **50** (lightest) to **900** (darkest)
- [ ] 50–100 for backgrounds
- [ ] 800–900 for text

### Alpha

- [ ] Main, light, dark, and accent can be used with alpha for overlays and subtle fills

### Implementation

- [ ] Token source: `src/theme/colors.ts` (TypeScript — works on native and web)
- [ ] All prototype colours linked to theme tokens
- [ ] Optional later: export CSS variables (`--brand-green-main`, etc.) from the same source

### Checklist

- [x] Brand colour tokens (main, light, dark, accent as hex)
- [x] Contrast token structure (main alt/tonal, light, dark; no accent contrast)
- [ ] Neutral 50–900 scale finalised
- [ ] WCAG AA verified on all contrast pairs
- [ ] Wireframe / app screens migrated from hardcoded hex
