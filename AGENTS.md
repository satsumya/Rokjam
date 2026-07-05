# Agent instructions

All agents (Cursor, Claude, Copilot, etc.) working in this repo **must** follow [docs/tickets/Standards.md](docs/tickets/Standards.md) for every UI, flow, copy, validation, and navigation change unless a flow ticket explicitly overrides a rule.

## Before writing code

1. Read **Standards.md** — it is the source of truth for forms, dates, locations, tags, bottom sheets, flow map upkeep, and more.
2. Read the relevant flow spec in **docs/tickets/Flow/** when changing a user journey.
3. Read Expo v56 docs at https://docs.expo.dev/versions/v56.0.0/ before writing Expo or React Native code.

## When changing a flow or screen

1. Implement the change in `app/` and/or `src/components/`.
2. Update the matching **docs/tickets/Flow/*.md** acceptance criteria if behaviour changed.
3. Update the **flow map** (required — CI enforces this when `app/` or `src/components/` change):
   - `src/constants/flowMap.ts` — journeys and screen entries
   - `scripts/flow-map-screens.json` + `src/constants/flowScreenImages.ts` — if the screen has a PNG preview
   - Run `npm run validate-flow-map:fix` then `npm run capture-flow-screens` (dev server on `:8081`)
   - Bump versions: `npm run bump-flow-map -- --flow <id> --level patch|minor|major`
4. Wrap testing-only UI in `<PrototypeOnly>` so flow-map screenshots hide it.
5. Run **`npm run check`** before finishing — must pass.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run check` | Typecheck + flow map validation + stale-flow guard |
| `npm run validate-flow-map` | Verify manifest, screens, PNGs, and flow specs align |
| `npm run capture-flow-screens` | Regenerate flow-map PNGs |
| `npm run bump-flow-map` | Bump screen or flow version |

See [docs/tickets/Testing.md](docs/tickets/Testing.md) for scenario tester and flow map maintenance.
