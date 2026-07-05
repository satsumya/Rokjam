# Standards

Cross-cutting rules for the Stage 1 prototype. Apply these in every flow unless a ticket explicitly calls for something different.

Referenced from flow specs in [`Flow/`](./Flow/).

## Forms & validation

- [x] Required and optional fields — Use `*` on required fields only; do not label fields as “optional”
- [x] New-user forms start blank — Fields that should be empty for a new user must not be prefilled (e.g. sign-up email/password)
- [x] Real-time input errors — Validate as the user types or on blur; do not wait until submit/continue
- [x] Email validation — Invalid email (e.g. missing `@`) shows an inline error
- [x] Password requirements — Enforce minimum standards (length, symbol, etc.) with inline feedback
- [x] Username availability — Check username is available; use `thegoat` as the taken username for testing
- [x] Do not label implied defaults — e.g. “Private”, not “Private (default)”

## Copy & UI text

- [x] No excess prototype text — Remove developer/context-only copy from the UI (e.g. “Returning user lands on dashboard”, “Stored as YYYY-MM-DD”, “Default option: cartoon pet rocks”)

## Dates & times

- [x] Date display format — Show dates as **Day DD Mmm YYYY** (e.g. Friday 03 Jul 2026)
- [x] Preset + custom dropdowns — Time and duration fields offer common presets and allow typing a custom value (e.g. end time, session duration)

## Lists & filters

- [x] Hide sort and filter when unnecessary — When a list has no items or only one item, hide sort and filter controls

## Locations

- [x] Address search — Location fields use address search with suggestions as the user types; offer “add anyway” when no match is found
- [x] Home location symbol — Mark home/base location with 🏠, not the words “home” or “base”

## Difficulty levels

- [x] Level colour required — Do not allow a level colour to be cleared without choosing a replacement

## Tags

- [x] Tag input pattern — Show added tags as removable chips; offer recommended tags to tap; typing is secondary

## Actions & navigation

- [x] Edit in context — Put editable fields near the action that needs them; do not tell users to go elsewhere (e.g. end time/duration in the save/end sheet)
- [x] Confirmations use bottom sheet — Destructive or final actions (delete session, save/end session) use a bottom sheet with clear confirm/cancel
- [x] Share when saved or ended — Share session/climb only after the session is saved or ended, not during active editing

## Flow map

The in-app flow map (`/flow-map`) documents prototype screens and journeys. Keep it in sync when flows or screens change.

### Version numbers

Flow sections and individual screens each have a version and last-updated timestamp in `src/constants/flowMapManifest.json`. All entries start at **0.0.0**.

Use **MAJOR.MINOR.PATCH** semantics:

| Change type | Bump | Example |
| --- | --- | --- |
| Minor bug fix, copy tweak, screenshot-only update | PATCH | 0.0.0 → 0.0.1 |
| Minor functionality or feature update | MINOR | 0.0.1 → 0.1.0 |
| Major functionality or feature update | MAJOR | 0.1.0 → 1.0.0 |

Bump manually when the change type is known:

```bash
npm run bump-flow-map -- --screen welcome --level patch
npm run bump-flow-map -- --flow sign-up-login --level minor
```

Recapturing screenshots updates **timestamps** automatically. Add `--bump patch` when recapture reflects a bug-fix-only change:

```bash
npm run capture-flow-screens -- --bump patch
```

### Adding or changing screens and flows

1. Update the screen or journey in `src/constants/flowMap.ts`.
2. If the screen has a PNG preview, add it to `scripts/flow-map-screens.json` and `src/constants/flowScreenImages.ts`.
3. Run `npm run validate-flow-map:fix` to add missing manifest entries.
4. Run `npm run capture-flow-screens` (dev server on `:8081`) to regenerate PNGs.
5. Bump the relevant screen and/or flow version with `npm run bump-flow-map`.
6. Run `npm run validate-flow-map` — must pass before merging.

Wrap testing-only UI in `<PrototypeOnly>` so screenshots hide it (`flowCapture=1` during capture).