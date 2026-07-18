## Typography system

Visual reference: `/typography` (linked from the Scenario tester). Tokens live in `src/theme/typography.ts` (pure tokens) and `src/theme/fonts.ts` (loadable assets). Consume them through the **`Text` atom** — pass a `variant`, never a raw `fontSize`.

Built on one modular scale, following the [accessible typography guide](https://accessibility.build/guides/accessible-typography-wcag):

- **Base body size:** 16px (WCAG-comfortable body minimum)
- **Ratio:** 1.333 (perfect fourth) — a single ratio across the whole system
- Each size is `16 × 1.333^step`, rounded to px

Sizes split into two groups drawn from that scale:

- **Headings** — 6 sizes (`headingSizes`, h6→h1): `16 · 21 · 28 · 38 · 51 · 67`
- **Body** — 3 sizes (`bodySizes`): `12` (small) · `16` (base) · `21` (large)

### Font families & weights

- **Headings:** Fira Sans — `FiraSans_400Regular`, `FiraSans_700Bold`
- **Body:** Saira — `Saira_400Regular`, `Saira_700Bold`

**Regular and bold are available for every size.** Each weight is a distinct family string (React Native loads weights as separate files); `fontWeight` is set alongside for react-native-web parity. Fonts load in `app/_layout.tsx` via `useFonts`, gated by the splash screen.

### Roles (`textVariants`)

Consume via the `Text` atom: `<Text variant="h2" weight="bold">`. Headings default to **bold**, body to **regular**; pass `weight="regular"` / `weight="bold"` to switch. Line-height follows the guide — tighter as size grows.

| Variant | Family | Size | Line-height | Default weight | Use |
| --- | --- | --- | --- | --- | --- |
| `h1` | Fira Sans | 67 | 1.1 | bold | Display / hero |
| `h2` | Fira Sans | 51 | 1.15 | bold | Page headings |
| `h3` | Fira Sans | 38 | 1.2 | bold | Large headings |
| `h4` | Fira Sans | 28 | 1.25 | bold | Screen titles |
| `h5` | Fira Sans | 21 | 1.3 | bold | Section, sheet & modal titles |
| `h6` | Fira Sans | 16 | 1.35 | bold | Small subheadings |
| `bodyLarge` | Saira | 21 | 1.5 | regular | Lead / emphasised copy |
| `body` | Saira | 16 | 1.5 | regular | Default body (base) |
| `bodySmall` | Saira | 12 | 1.5 | regular | Hints, meta, captions |

The scale consolidates the old ad-hoc sizes: 13/14/15 → 16 body, 11 → 12 small, 18/22/24 → 21/28, 32 → 28. Migrating existing hardcoded `fontSize` usages to the `Text` atom is the follow-up (mirrors the colour migration still in progress).

### Checklist

- [x] Modular type scale (base 16, ratio 1.333)
- [x] Heading (6) and body (3) size groups, regular + bold for each
- [x] Fira Sans (headings) + Saira (body) loaded via `useFonts`
- [x] Composite `textVariants` roles + `Text` atom with `weight` prop
- [x] `/typography` visual reference page
- [ ] App screens migrated from hardcoded `fontSize` to the `Text` atom
- [ ] WCAG 1.4.12 text-spacing override verified on key screens

## Colour system

Visual reference: `/color-system` (also linked from Scenario tester). Tokens live in `src/theme/colors.ts`.

### Brand palettes

Each brand colour has four shades — all defined as **explicit hex values** (not generated):

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

Brand colours (display order = `BRAND_COLOR_ORDER` — rainbow, then black / white):

`red → orange → yellow → green → blue → purple → pink → black → white`

Level presets (`DEFAULT_LEVEL_COLORS`) and button colour-style galleries map from this array. Do not maintain a second hardcoded order in UI code.

### Semantic palettes

Semantic colours: negative, attention, positive, info, discovery. Defined in `SEMANTIC_PALETTES` (`src/theme/colors.ts`).

Each semantic colour has **three manually chosen hex values** plus a derived `main`:

| Token | Source | Use |
| --- | --- | --- |
| **accent** | manual hex | Accent fills, borders, icons |
| **accent.contrast** | manual hex | Text/icon on the accent |
| **main** | `neutral[900]` mixed with the accent (`mainMix`, default 0.12) | Message/banner surface |
| **main.contrast** | manual hex | Text on main |

Example tokens for `semantic.positive`:

- `semantic.positive.main` (derived)
- `semantic.positive.main.contrast`
- `semantic.positive.accent`
- `semantic.positive.accent.contrast`

Adjust the mix per colour with `mainMix` on its `SEMANTIC_PALETTES` entry.

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

Semantic colours use their own contrast tokens (`main.contrast`, `accent.contrast`) — see Semantic palettes above.

### Neutral

- [ ] Sandy/beige neutral scale — 10 shades from **50** (lightest) to **900** (darkest)
- [ ] 50–100 for backgrounds
- [ ] 800–900 for text

### Alpha

- [ ] Main, light, dark, and accent can be used with alpha for overlays and subtle fills

### Implementation

- [x] Token source: `src/theme/colors.ts` (TypeScript — works on native and web)
- [x] Brand display order: `BRAND_COLOR_ORDER` (single source for colour system, level presets, button styles)
- [x] Level presets: `DEFAULT_LEVEL_COLORS` / `levelPreset()` in `src/constants/difficultyLevels.ts`
- [x] Colour picker geometry: `colorPickerGeometry` in `src/theme/colorPicker.ts`
- [x] Layout: `layout` + `pageGutter` in `src/theme/layout.ts`
- [ ] All prototype colours linked to theme tokens
- [ ] Optional later: export CSS variables (`--brand-green-main`, etc.) from the same source

### Checklist

- [x] Brand colour tokens (main, light, dark, accent as hex)
- [x] Brand contrast token structure (main alt/tonal, light, dark; no accent contrast)
- [x] Semantic tokens (manual accent, accent contrast, main contrast; main = neutral 800 tinted with accent)
- [ ] Neutral 50–900 scale finalised
- [ ] WCAG AA verified on all contrast pairs
- [ ] Wireframe / app screens migrated from hardcoded hex
