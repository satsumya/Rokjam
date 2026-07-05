# Agent instructions

All agents (Cursor, Claude, Copilot, etc.) working in this repo **must** follow [docs/tickets/Standards.md](docs/tickets/Standards.md) for every UI, flow, copy, validation, and navigation change unless a flow ticket explicitly overrides a rule.

## Before writing code

1. Read **Standards.md** — it is the source of truth for forms, dates, locations, tags, bottom sheets, flow map upkeep, and more.
2. Read the relevant flow spec in **docs/tickets/Flow/** when changing a user journey.
3. Read Expo v56 docs at https://docs.expo.dev/versions/v56.0.0/ before writing Expo or React Native code.

## When changing a flow or screen

1. Implement the change in `app/` and/or `src/components/`.
2. Update the matching **docs/tickets/Flow/*.md** acceptance criteria if behaviour changed.
3. Register new screens in the flow map (`flowMap.ts`, `flow-map-screens.json`, `flowScreenImages.ts` if needed) and run `npm run validate-flow-map:fix`.
4. Wrap testing-only UI in `<PrototypeOnly>` so flow-map screenshots hide it.
5. **Refresh screenshots from the flow map page** using **Update** / **Update all** (requires `npm run flow-map-capture-server` in a second terminal), or run `npm run capture-flow-screens` from the CLI.
6. Run **`npm run check`** before finishing.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run check` | Typecheck + flow map structural validation |
| `npm run flow-map-capture-server` | Local API for flow map **Update** buttons |
| `npm run validate-flow-map` | Verify manifest, screens, PNGs, and flow specs align |
| `npm run capture-flow-screens` | Regenerate all flow-map PNGs from CLI |
| `npm run bump-flow-map` | Bump screen or flow version |

See [docs/tickets/Testing.md](docs/tickets/Testing.md) for scenario tester and flow map maintenance.
