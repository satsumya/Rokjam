# Standards

Cross-cutting rules for the Stage 1 prototype. Apply these in every flow unless a ticket explicitly calls for something different.

Referenced from flow specs in [`Flow/`](./Flow/).

## Forms & validation

- [x] Required and optional fields — Use `*` on required fields only; do not label fields as “optional”
- [x] No double headings — Do not repeat a Section/Modal/Screen title as a field label underneath (e.g. Section “Locations” + field “Location”). Keep the section/modal title; omit the field label. If the field is required, put the `*` on the section title instead
- [x] New-user forms start blank — Fields that should be empty for a new user must not be prefilled (e.g. sign-up email/password)
- [x] Real-time input errors — Validate as the user types or on blur; do not wait until submit/continue
- [x] Email validation — Invalid email (e.g. missing `@`) shows an inline error
- [x] Password requirements — Enforce minimum standards (length, symbol, etc.) with inline feedback
- [x] Username availability — Check username is available; use `thegoat` as the taken username for testing
- [x] Do not label implied defaults — e.g. “Private”, not “Private (default)”

## Copy & UI text

- [x] No excess prototype text — Remove developer/context-only copy from the UI (e.g. “Returning user lands on dashboard”, “Stored as YYYY-MM-DD”, “Default option: cartoon pet rocks”)

## Typography

- [ ] Text source — All UI text comes from the `Text` atom with a `variant` from the type scale (`src/theme/typography.ts`). Never hardcode `fontSize`, `fontFamily`, or `lineHeight`
- [ ] Type scale — One modular scale: base body **16px**, ratio **1.333** (perfect fourth). Headings (6): 16 · 21 · 28 · 38 · 51 · 67 (`h6`–`h1`); body (3): 12 · 16 · 21 (`bodySmall`, `body`, `bodyLarge`)
- [ ] Font families & weights — Fira Sans for headings, Saira for body; regular + bold available for every size via the `weight` prop (headings default bold, body default regular)
- [ ] Roles — Use the semantic variant, not a size: `h4` for screen titles, `h5` for section/sheet/modal titles, `body` for copy, `bodyLarge`/`body` `weight="bold"` for labels & buttons, `bodySmall` for hints/meta. See DesignSystem.md § Typography for the full table

## Iconography

- [x] Icon source — All UI icons come from the `Icon` atom (Phosphor). Never hardcode emoji or glyph characters as icons
- [x] Icon size scale — Size icons with the scale tokens passed to `Icon`'s `size` prop, not raw pixel numbers: `xs` 16, `sm` 20, `md` 24, `lg` 32, `xl` 40 (e.g. `<Icon name="house" size="xs" />`)
- [x] Icon weight — Weight follows size automatically: xs/sm → fill, md/lg/xl → bold. Allowed weights are regular, bold, fill, duotone (thin and light are disabled); regular and duotone aren't size-mapped and are manual-only. Only pass an explicit `weight` for semantic exceptions (e.g. an unchecked checkbox or unmet hint stays regular)

## Dates & times

- [x] Date display format — Show dates as **Day DD Mmm YYYY** (e.g. Friday 03 Jul 2026)
- [x] Time display format — Use **h:mm AM/PM** (e.g. 6:30 PM, 12:00 PM) for stored and displayed session times
- [x] Time field UI — All session time fields use `SessionTimeDropdown` (`WireframeDropdown` with the standard time list). No free-text time inputs
- [x] Time dropdown options — **12:00 AM** through **11:45 PM** in **15-minute** steps (96 options). Auto-filled times snap to the nearest quarter hour
- [x] Preset + custom dropdowns — Duration fields may offer presets plus a custom value; time fields do not use custom text entry
- [x] Dropdown menus — Pickers use a true dropdown (native `<select>` on web; floating overlay menu on native). Do not use inline accordion-style expand/collapse

## Lists & filters

- [x] Hide sort and filter when unnecessary — When a list has no items or only one item, hide sort and filter controls

## Locations

- [x] Address search — Location fields use address search with suggestions as the user types; offer “add anyway” when no match is found; suggestions in a capped, scrollable list
- [x] Home location symbol — Mark home/base location with the house icon (`<Icon name="house" />`), not the words “home” or “base”

## Difficulty levels

- [x] Level colour required — Do not allow a level colour to be cleared without choosing a replacement

## Tags

- [x] Tag input pattern — Show added tags as removable chips; offer recommended tags to tap; typing is secondary

## Actions & navigation

- [x] Edit in context — Put editable fields near the action that needs them; do not tell users to go elsewhere (e.g. end time/duration in the save/end sheet)
- [x] Confirmations use bottom sheet — Destructive or final actions (delete session, save/end session) use a bottom sheet with clear confirm/cancel
- [x] Complex forms in context — Multi-step adds opened mid-flow (e.g. location + difficulty levels during a session) use a centered modal with scrollable body and pinned footer actions, not a bottom sheet
- [x] Share when saved or ended — Share session/climb only after the session is saved or ended, not during active editing

## Flow map

The in-app flow map (`/flow-map`) documents prototype screens and journeys. Keep it in sync when flows or screens change.

### Screen names & download filenames

Each flow map screen has a **label** and optional **descriptors** in `src/constants/flowMap.ts`. Use descriptors only when variants share the same label (e.g. several Dashboard states).

**On the flow map** — `Label | Descriptor one | Descriptor two` (` | ` between parts). Screens with no descriptors show the label only. End-session sheets use label **Active session** with tag **End** (display: `Active session | End`).

**Downloaded PNGs** — Same parts joined with `--`; spaces become hyphens; version appended last:

`{step}.{scenario}[.{substep}]-[{Tag}-]{Label--Descriptor-one--Descriptor-two}--v0.0.0.png`

**Flow placement prefix** (per journey, on each node in `flowMap.ts`):

| Part | Meaning |
| --- | --- |
| **step** | Left-to-right position in the journey (1, 2, 3…) |
| **scenario** | Alternate path at that step (`0` = only one path; `1`, `2`… = first, second alternate) |
| **substep** | Optional — state further in the journey on the same step but not a new screen (e.g. end sheet overlays: `4.0.1`, `4.0.2`) |

When `placement` is omitted on a node, it defaults from layout: step = column index + 1; scenario = `0` when alone, else node index + 1.

**End session sheets** — `downloadTag: 'End'` adds `[End]-` after the placement prefix. Label is **Active session** (not “Save / end session”).

Examples (session create flow):

| Display | Download |
| --- | --- |
| Dashboard \| Profile complete \| No sessions | `1.1-Dashboard--Profile-complete--No-sessions--v0.0.0.png` |
| Dashboard \| Blank profile \| No climbs | `1.2-Dashboard--Blank-profile--No-climbs--v0.0.0.png` |
| Active session \| Add climb | `3.0-Active-session--Add-climb--v0.0.0.png` |
| Active session \| End | `4.0.1-[End]-Active-session--v0.0.0.png` |
| Active session \| End \| End time set | `4.0.2-[End]-Active-session--End-time-set--v0.0.0.png` |
| Dashboard \| Mid-session | `5.3-Dashboard--Mid-session--v0.0.0.png` |
| Welcome | `1.0-Welcome--v0.0.0.png` |

Internal asset ids (e.g. `dashboard-new.png` in `assets/flow-screens/`) stay as stable slugs; only display names and download filenames use this convention.

### Version numbers

Flow sections and individual screens each have a version and last-updated timestamp in `src/constants/flowMapManifest.json`. All entries start at **0.0.0**.

Use **MAJOR.MINOR.PATCH** semantics:

| Change type | Bump | Example |
| --- | --- | --- |
| Minor bug fix, copy tweak, screenshot-only update | PATCH | 0.0.0 → 0.0.1 |
| Minor functionality or feature update | MINOR | 0.0.1 → 0.1.0 |
| Major functionality or feature update | MAJOR | 0.1.0 → 1.0.0 |

**Automatic patch bumps** — **Update** / **Update all** on `/flow-map` (and `npm run capture-flow-screens`) compare each new PNG to the existing file. When the screenshot changed, the screen gets a **patch** bump and its **version-updated** timestamp updates; affected flow sections bump **patch** too. Unchanged screenshots leave version and timestamp as-is (timestamps reflect the last version change, not the last capture attempt). Restart `npm run flow-map-capture-server` after pulling capture-script changes.

**Manual bumps** — Use when the change type is known but screenshots are unchanged, or for minor/major releases:

```bash
npm run bump-flow-map -- --screen welcome --level patch
npm run bump-flow-map -- --flow sign-up-login --level minor
```

Force a bump on every captured screen regardless of visual change (CLI only):

```bash
npm run capture-flow-screens -- --bump patch
```

### Adding or changing screens and flows

1. Update `src/constants/flowMap.ts` (and `flow-map-screens.json` + `flowScreenImages.ts` for PNG previews).
2. Run `npm run validate-flow-map:fix`.
3. Refresh screenshots via **Update** on the flow map page, or `npm run capture-flow-screens`.
4. Use `npm run bump-flow-map` for **minor** or **major** bumps when appropriate.

Wrap testing-only UI in `<PrototypeOnly>` (`flowCapture=1` during capture).

### Automation

| Command | Purpose |
| --- | --- |
| `npm run flow-map-capture-server` | Powers **Update** / **Update all** on the flow map page |
| `npm run capture-flow-screens` | Regenerate every PNG from the CLI |
| `npm run validate-flow-map` | Structural checks (manifest, screens list, flow specs) |
| `npm run check` | Typecheck + validate-flow-map |

Use **Update** buttons on `/flow-map` after UI changes (with the capture server and `npm run web` running). Patch versions bump automatically when the screenshot changed.

Agents must follow [AGENTS.md](../../AGENTS.md) and `.cursor/rules/` — both reference this file.