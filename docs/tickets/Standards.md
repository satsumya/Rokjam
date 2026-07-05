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
- [x] Dropdown menus — Preset pickers use a true dropdown (native `<select>` on web; floating overlay menu on native). Do not use inline accordion-style expand/collapse for preset selection

## Lists & filters

- [x] Hide sort and filter when unnecessary — When a list has no items or only one item, hide sort and filter controls

## Locations

- [x] Address search — Location fields use address search with suggestions as the user types; offer “add anyway” when no match is found; suggestions in a capped, scrollable list
- [x] Home location symbol — Mark home/base location with 🏠, not the words “home” or “base”

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

1. Update `src/constants/flowMap.ts` (and `flow-map-screens.json` + `flowScreenImages.ts` for PNG previews).
2. Run `npm run validate-flow-map:fix`.
3. Refresh screenshots via **Update** on the flow map page, or `npm run capture-flow-screens`.
4. Bump versions with `npm run bump-flow-map` when appropriate.

Wrap testing-only UI in `<PrototypeOnly>` (`flowCapture=1` during capture).

### Automation

| Command | Purpose |
| --- | --- |
| `npm run flow-map-capture-server` | Powers **Update** / **Update all** on the flow map page |
| `npm run capture-flow-screens` | Regenerate every PNG from the CLI |
| `npm run validate-flow-map` | Structural checks (manifest, screens list, flow specs) |
| `npm run check` | Typecheck + validate-flow-map |

Use **Update** buttons on `/flow-map` after UI changes (with the capture server and `npm run web` running). Bump versions manually when appropriate.

Agents must follow [AGENTS.md](../../AGENTS.md) and `.cursor/rules/` — both reference this file.