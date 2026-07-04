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
| **Flow map** | Visual journey diagram with screen previews — tap any screen to jump in |
| Mock values | Shown on scenario page (credentials, `thegoat`, verify code, address search) |

Each **Run scenario** button resets app state, applies the scenario setup, then navigates to the route.

## Setups

| Setup | State |
| --- | --- |
| `fresh` | Empty — new user |
| `profile-only` | Profile + location, no sessions, no username |
| `returning` | `alex_climber` with profile, tags, and demo sessions |

## Mock credentials

See [README.md](./README.md#mock-credentials--test-values) for full list and direct links.
