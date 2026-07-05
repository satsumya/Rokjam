# Testing

Scenario coverage for the Stage 1 prototype.

1. Run `npm run web` in the repo root.
2. Open the **[scenario tester](http://localhost:8081/scenarios)** (use the Metro URL from your terminal if the port differs).
3. Or from the running app: welcome screen → **Scenario tester**.

## Requirements

- [x] Able to run each flow
- [x] Able choose whether to run as a new user or existing user
- [x] Able to run scenarios with and without data or alternative user scenarios
- [x] Able to run error scenarios

## Scenario tester features

| Feature | Where |
| --- | --- |
| Filter by flow | SignUpLogin, MemberProfile, ClimbingSessionCreate, etc. (matches `Flow/*.md` specs) |
| Filter by user type | New user, existing user, or all — also drives setup for “any user” scenarios |
| Filter by path type | Happy, alternate, error |
| **Flow map** | Visual journey diagram with screen previews — tap any screen to jump in; bulk download per flow; version/timestamp per flow and screen |
| Mock values | Shown on scenario page (credentials, `thegoat`, verify code, address search) |

Each **Run scenario** button resets app state, applies the scenario setup, then navigates to the route.

## Flow map maintenance

```bash
npm run check                    # typecheck + validate + stale-flow guard (run before every commit)
npm run setup-hooks              # one-time: install pre-commit hook
npm run validate-flow-map        # check manifest, screens list, and PNG assets match
npm run validate-flow-map:fix    # add missing manifest entries
npm run capture-flow-screens     # regenerate PNGs + update timestamps
npm run bump-flow-map -- --screen welcome --level patch
```

CI on GitHub runs `npm run check` on every push and PR. The stale-flow guard blocks screen changes that omit flow-map updates.

See [Standards.md](./Standards.md#flow-map) for version bump rules and the checklist when adding screens or flows. Agents must follow [AGENTS.md](../../AGENTS.md).

## Setups

| Setup | State |
| --- | --- |
| `fresh` | Empty — new user |
| `profile-only` | Profile + location, no sessions, no username |
| `returning` | `alex_climber` with profile, tags, and demo sessions |

## Mock credentials

See [README.md](./README.md#mock-credentials--test-values) for full list and direct links.
