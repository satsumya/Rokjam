# Standards

Cross-cutting rules for the Stage 1 prototype. Apply these in every flow unless a ticket explicitly calls for something different.

Referenced from flow specs in [`Flow/`](./Flow/).

## Forms & validation

- [x] Required and optional fields — Use `*` on required fields only; do not label fields as “optional”
- [ ] New-user forms start blank — Fields that should be empty for a new user must not be prefilled (e.g. sign-up email/password)
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

## Lists & search

- [x] Hide search and filter when unnecessary — When a list has no items or only one item, hide search and filter controls

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