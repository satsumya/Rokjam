# Testing

Scenario coverage for the Stage 1 prototype. Requires **prototype** app mode (default).

1. Run `npm run web` in the repo root.
2. Open the **[scenario tester](http://localhost:8081/scenarios)** (use the Metro URL from your terminal if the port differs).
3. Or from the running app: welcome screen → **Scenario tester**.

## Requirements

- [x] Able to run each flow
- [x] Able choose whether to run as a new user or existing user
- [x] Able to run scenarios with and without data or alternative user scenarios
- [x] Able to run error scenarios

## App mode (prototype vs production)

Set `EXPO_PUBLIC_APP_MODE` to control which routes and tooling are available:

| Mode | Command | Behaviour |
| --- | --- | --- |
| **prototype** (default) | `npm run web` or `npm run web:prototype` | Product routes + scenario tester, flow map, colour system, typography, icon library |
| **production** | `npm run web:production` | Product routes only — prototype pages redirect to welcome; prototype UI hidden |

Prototype-only routes: `/scenarios`, `/flow-map`, `/color-system`, `/typography`, `/icon-library`.

Flow-map PNG capture and the scenario tester require **prototype** mode. Store/EAS production builds should set `EXPO_PUBLIC_APP_MODE=production` at build time.

Both modes still use the **mock data adapter** until Phase 4 (real API).

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

**In the app** (recommended after UI changes):

1. Terminal 1: `npm run web`
2. Terminal 2: `npm run flow-map-capture-server`
3. Open `/flow-map` → **Update** on a screen, **Update all** on a flow section, or **Update all flows** at the top for every journey. Patch versions bump automatically when the screenshot changed; unchanged screens keep their version.

**CLI** (all screens at once):

```bash
npm run capture-flow-screens     # dev server on :8081 required
```

**Structure & versions:**

```bash
npm run check                    # typecheck + validate flow map structure
npm run validate-flow-map:fix    # add missing manifest entries
npm run bump-flow-map -- --screen welcome --level patch
```

See [Standards.md](./Standards.md#flow-map) for version bump rules. Agents must follow [AGENTS.md](../../AGENTS.md).

## Setups

| Setup | State |
| --- | --- |
| `fresh` | Empty — new user |
| `profile-only` | Profile + location, no sessions, no username |
| `returning` | `alex_climber` with profile, tags, and demo sessions |

## Mock credentials

See [README.md](./README.md#mock-credentials--test-values) for full list and direct links.
