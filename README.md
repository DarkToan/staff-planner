# StaffPlanner — frontend demonstration

A locally runnable, browser-only staffing and absence-review prototype built with **React Native + Expo 58, Expo Router, TypeScript, Tamagui 3, and FullCalendar React**. No application backend or external API is used.

## Requirements and launch

- **Node.js 22.13+ on the 22 LTS line** (tested with 22.22.3). Expo also supports Node `^24.3.0`, `^26.0.0`, and `>=27.0.0`.
- npm (installation tested with 8.19.2); use the committed lockfile for reproducible dependencies.
- A current desktop browser. Automated browser checks were run in locally installed Google Chrome, plus a 390 × 844 narrow viewport.

From the project directory:

```sh
npm ci
npm run web
```

Open **http://localhost:8081**. Expo's server only serves frontend assets and development tooling; it is not an application API server. The VS Code **StaffPlanner: web demo** task runs the same app with Expo's external tooling checks disabled.

If Expo's compatibility/update services are unreachable (for example behind a corporate TLS proxy), use the already-installed compatible packages in offline mode:

```sh
npm run web -- --offline
```

Do not disable TLS certificate validation. Initial dependency installation still requires registry access. No runtime CDN, remote font, mailbox, or AI service is needed.

## Sharing on Vercel

The root Vercel configuration builds the static web export into `dist` and rewrites application routes to the SPA entry point, so shared links and page refreshes work. Static assets and sample exports are served directly. No backend or real authentication is added: anyone with access to the deployment can enter the fictional demo.

For an account-owned deployment, import this repository into Vercel, select **Other** as the framework, and use the committed configuration. Alternatively, run `npx vercel` from the project directory after signing in to Vercel. Use Node.js 22.x or another Expo-compatible version listed above. Only add `EXPO_PUBLIC_FULLCALENDAR_LICENSE_KEY` if you hold a license appropriate to the hosted use; it is public browser configuration, not a secret.

An account-free temporary deployment can also be made from a locally built static export. Temporary links are not a substitute for a permanent, account-owned deployment; follow Vercel's claim and expiration information when publishing. Confirm FullCalendar's applicable licensing terms before hosting or wider distribution, and review the dependency advisory limitation below. This demo is not production-hardened.

If Vercel CLI reports `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` behind a corporate TLS proxy, supported Node versions can use the operating system's trusted certificate store with `NODE_USE_SYSTEM_CA=1`. Keep certificate verification enabled. If browser sign-in endpoints remain blocked by the network, deploy by importing the repository in Vercel's dashboard from an approved network instead. Temporary deployment availability is controlled by Vercel and is not guaranteed.

## Walk through the demo

1. Select **Sign in to demo**. Prefilled credentials are fictional and never validated.
2. On **Overview**, choose **Connect Office 365**, then **Confirm simulated connection**. This only changes an in-memory badge; there is no OAuth flow.
3. Choose **Process new emails**. Five scripted stages run for **6.5 seconds**. Navigate to Emails or another page while the global progress indicator stays active. Duplicate processing is disabled.
4. The batch reveals **12 processed emails**: **7 absence-related**, **4 unrelated**, **1 requiring clarification**. They support **6 request records**, including paired original/amendment and original/cancellation messages. Two archived source emails and two baseline approved requests are separate from this batch.
5. Before decisions, the resulting request list contains **4 pending, 3 approved, and 1 needs clarification**. Approved counts are request records, not individual dates; Chloe's two dates belong to one request. Two coverage warnings are fixed hypothetical examples, not calculated live alerts.
6. Open **Staffing calendar**. It opens on **19–23 October 2026**, in **Europe/London**, with eight employee rows, grey scheduled shifts, and distinct absence overlays. Switch to **Month overview**, filter, or use Previous / Today / Next. **Demo week** returns to the fixture period regardless of the real date. Other weeks intentionally have no work fixtures.
7. Select an absence using a mouse or keyboard. Review the requested time, exact dates, sender, quote, full email, supporting messages, fictional history, and fixed impact figures. Approve, decline, or request clarification with a confirmation. Status updates appear across the list, calendar, and dashboard.
8. Diego's **Accept amendment** replaces his original full-day leave with the proposed afternoon only. **Keep original leave** preserves the original approved block. Eva's **Accept cancellation** removes her original absence; **Keep original leave** leaves it approved. These flows never create a second active absence. Finn's ambiguous date is not guessed or placed on the calendar; approval is intentionally unavailable for that undated fixture.
9. On Emails, inspect **Ben's unread-but-processed message**: read state and processing state are independent. The illustrative category is **StaffPlanner-Processed**. Processing is not manager approval.
10. Choose **Export sample** in the calendar. Select Approved absences or Work schedule and CSV or ICS. Each download is a static local sample, **not a live export of your selections**, and is not affected by filters or decisions.
11. Process again to see the no-new-emails notice. **Reset demo** restores initial records, the disconnected mailbox, processing state, open panels, and activity. Reset cancels pending scripted timers. **Sign out** only returns to the login screen; it is not session management. Reloading also resets the in-memory state.

## FullCalendar Premium licensing — important

- The application uses the **real Premium resource timeline**, not a substitute table. Standard month rendering uses the official DayGrid plugin.
- All FullCalendar packages are pinned to **6.1.22**. At implementation time the current React package was 7.1.3 while the registry's resource-timeline package was 6.1.22; mixing those majors would be incompatible.
- **No license key is fabricated, bundled, or committed.** With no key configured, FullCalendar displays its own **“Your license key is invalid”** warning. This is intentional and is not a runtime failure. The warning is not hidden by CSS.
- The official [Premium evaluation documentation](https://fullcalendar.io/docs/premium) permits evaluation but excludes commercial production use and distribution of modifications to the Premium source under its evaluation terms. This demo references the unmodified Premium package through npm and is intended for local evaluation only. A client demonstration is not blanket permission to redistribute or commercially deploy it. Confirm the applicable terms with FullCalendar before client delivery or hosting.
- A commercial production application must obtain the appropriate commercial license. See [FullCalendar licensing](https://fullcalendar.io/license), [pricing](https://fullcalendar.io/pricing), and the license supplied with the installed Premium package. Do not assume an evaluation or nonprofit key permits commercial use.
- If you hold a legitimate key appropriate to your use, set **EXPO_PUBLIC_FULLCALENDAR_LICENSE_KEY** in your local environment or an uncommitted local environment file, then restart Expo. It is read only in the web scheduler component. Expo-public values are included in browser bundles; do not put secrets in them. This project does not validate licensing or supply a key for you.
- FullCalendar Standard plugins use the MIT license; Premium terms are separate. Package licenses remain in the installed dependencies.

## Checks

```sh
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

The build produces a static Expo web export. It contains no application server. Playwright starts the Expo development server automatically if one is not running at port 8081.

If browser downloads are blocked by certificate policy, use an installed Chrome or Edge **without weakening TLS**:

```sh
# Bash / Git Bash
PLAYWRIGHT_CHANNEL=chrome npm test

# PowerShell
$env:PLAYWRIGHT_CHANNEL = 'chrome'; npm test
```

Use `msedge` instead of `chrome` to select Edge. Otherwise configure your organization's trusted CA for browser downloads.

**Actually checked during implementation:** TypeScript compilation, static Expo web export, fixture consistency/presentation checks, and desktop/narrow-screen Playwright workflows. The browser tests cover login, simulated connection, processing surviving navigation, processed/read distinction, timeline and month views, navigation to the demo week, source evidence, status consistency, amendment/cancellation review, all four downloads, replay/reset, and sign-out. They also check for uncaught browser errors and external HTTP requests on the main flow. Visual screenshots were inspected; this is not a formal accessibility audit or real-device/native test.

**Dependency advisory limitation:** `npm audit --omit=dev` reported **26 transitive findings (19 high, 7 moderate)** in Expo/Metro/native tooling chains involving braces, node-forge, and uuid. The suggested forced fix would downgrade Expo to 44, breaking this SDK setup, so it was not applied. There is no application backend and the affected toolchains are not used for real mailbox/production services here; this does not mean the advisories are harmless. Keep the demo local, avoid untrusted projects/input, and reassess/upstream-upgrade before broader distribution. This prototype is not production-hardened.

## Organization

```text
app/                              Expo Router entries only
	_layout.tsx                     Root providers and theme
	index.tsx                       Login route
	(workspace)/                    Workspace layout and five page routes
src/
	components/
		layout/WorkspaceShell.tsx     Shared sidebar, header, and page shell
		ui.tsx                        Shared Tamagui UI primitives
	demo/                           Fixtures, in-memory state, display helpers
	features/
		login/LoginScreen.tsx         Fictional demo sign-in
		dashboard/OverviewScreen.tsx  Overview and mailbox connection simulation
		mailbox/EmailsScreen.tsx     Fictional inbox
		requests/
			RequestsScreen.tsx          Request list and filters
			DetailPanels.tsx            Evidence, decisions, and confirmation panels
		scheduling/
			StaffingBoard.web.tsx      FullCalendar web implementation
			StaffingBoard.tsx          Explanatory native fallback
			components/                Reusable coverage summary
		settings/SettingsScreen.tsx   Demo settings
	theme/                          Shared web styles
public/exports/                   Four intentionally tracked static samples
tests/
	e2e/                            Browser workflows and responsive layout tests
	unit/                           Fixture and display-helper checks
docs/
	FRONTEND_PROTOTYPE_PROMPT.md    Original prototype specification
.vscode/                          Shared run task and clean Explorer settings
```

The [original specification](docs/FRONTEND_PROTOTYPE_PROMPT.md) is preserved in the documentation folder. Keep route entries small: screen implementations belong to their feature, reusable primitives belong to shared components, and all mock data/state belongs to the demo folder. The coverage summary is a scheduling component reused by the dashboard; the scheduler does not import a dashboard screen. Browser and fixture tests both use the existing Playwright runner, with no second test framework.

Runtime/tool configuration stays at the repository root so Expo, Tamagui, TypeScript, npm, and Playwright can discover it conventionally. Import the scheduler without a platform suffix so Expo selects the web implementation correctly. Route URLs and run commands are unchanged.

### Repository hygiene

The ignore rules exclude dependencies, build output, Expo/Metro/Tamagui caches, test results, coverage reports, logs, local environment files, signing keys, and personal editor/OS files. A sanitized environment example is allowed, but real environment values and license keys must remain local. The lockfile, shared VS Code configuration, original specification, and sample exports intentionally remain versioned.

Generated folders are retained locally so builds and tests remain inspectable, but are hidden from VS Code Explorer through the shared settings. Ignoring a file does not untrack an already-versioned file; no generated outputs were tracked when this cleanup was performed. Git staging is left to the developer.

## Explicit non-goals

No backend/API, authentication/session service, OAuth, Microsoft Graph, real inbox access, network integrations, LLM/Ollama, database, persistence, real staffing/coverage calculations, policy validation, real notifications/email sending, live export generation, synchronization, Cloudflare, or production infrastructure. Counts and filtering summarize fixture UI state; they are not business calculations. Coverage examples remain fixed after decisions and are labeled accordingly.

Native iOS is **future work**. Expo is configured for web only. The native scheduler entry is an explanatory fallback, not a native scheduling implementation. Web-specific DOM/CSS is used where appropriate; a future native client will require its own shell/scheduler adaptations.