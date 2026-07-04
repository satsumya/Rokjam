# Rokjam prototype tickets

Local specs for Stage 1 flows. Each file contains **acceptance criteria** plus **Review updates** from review feedback.

Edit checkboxes in the ticket files as you implement or verify.

## Standards

Cross-cutting rules (date format, required fields, validation, etc.) live in **[Standards.md](./Standards.md)**. Flow specs reference these by default.

## Testing

Scenario coverage requirements and how to use the scenario tester: **[Testing.md](./Testing.md)**.

## Flows

| Ticket | Flow |
| --- | --- |
| [ROKJ-3](./Flow/SignUpLogin.md) | Sign up / login |
| [ROKJ-15](./Flow/MemberProfile.md) | Member profile setup |
| [ROKJ-16](./Flow/ClimbingSessionCreate.md) | Create climbing session |
| [ROKJ-17](./Flow/ClimbingSessionViewEdit.md) | View and edit session |
| [ROKJ-18](./Flow/Dashboard.md) | Dashboard trends |
| [ROKJ-22](./Flow/Community.md) | Community feed |

## How to run

```bash
npm install
npm run web
```

1. Wait for Metro to finish bundling (watch the terminal for a URL like `http://localhost:8081`).
2. Open the **[scenario tester](http://localhost:8081/scenarios)** in your browser, or tap **Scenario tester** on the app welcome screen.

If port 8081 is in use, Expo picks another port — use the URL shown in your terminal.

For Expo Go: `npm start` and scan the QR code, then open **Scenario tester** from the welcome screen.

## Mock credentials & test values

| Use | Value |
| --- | --- |
| Returning user email | `returning.user@example.com` |
| Returning user username | `alex_climber` |
| Password | `Password1!` |
| Taken username (profile or public session) | `thegoat` |
| Invalid verification code | `000000` |
| Valid verification code | Any other 6 digits (e.g. `123456`) |
| Address search (profile / session location) | Type `Kangaroo` for suggestions |

Login accepts **email or username**. Sign up with `returning.user@example.com` redirects to login (existing user).

## Direct links (local web)

Base URL: **http://localhost:8081**

### ROKJ-3 — Sign up / login

| Scenario | Link |
| --- | --- |
| Scenario tester | http://localhost:8081/scenarios |
| Welcome | http://localhost:8081/ |
| Sign up (blank fields) | http://localhost:8081/auth/signup |
| Sign up validation error | http://localhost:8081/auth/signup?demo=error-empty |
| Verify email (code) | http://localhost:8081/auth/verify-email |
| Login (prefilled) | http://localhost:8081/auth/login?demo=prefill |
| Login validation error | http://localhost:8081/auth/login?demo=error-empty |
| Forgot password | http://localhost:8081/auth/forgot-password |
| Welcome after sign up (skip profile) | http://localhost:8081/welcome-signup |

### ROKJ-15 — Member profile

| Scenario | Link |
| --- | --- |
| Profile setup | http://localhost:8081/profile/setup |
| No location on complete | http://localhost:8081/profile/setup?demo=error-no-location |
| Full new-user journey | Sign up → verify → welcome → profile |

### ROKJ-16 — Create session

| Scenario | Link |
| --- | --- |
| Profile + sessions ready | http://localhost:8081/dashboard?demo=session-ready |
| New user, no sessions yet | http://localhost:8081/dashboard?demo=new-user |
| Start session (any state) | http://localhost:8081/sessions/create → active session |
| Incomplete profile, start anyway | http://localhost:8081/sessions/create |

### ROKJ-17 — View / edit session

| Scenario | Link |
| --- | --- |
| Dashboard with sessions | http://localhost:8081/dashboard?demo=session-ready |
| All sessions list | http://localhost:8081/sessions?demo=seed |

### ROKJ-18 — Dashboard trends

| Scenario | Link |
| --- | --- |
| Trends (seed sessions if empty) | http://localhost:8081/dashboard?demo=seed |

### ROKJ-22 — Community

| Scenario | Link |
| --- | --- |
| Community feed | http://localhost:8081/community |

## Regenerate from Jira

```bash
node scripts/jira-export-to-markdown.js
```

Raw snapshots: `docs/tickets/_raw/`
