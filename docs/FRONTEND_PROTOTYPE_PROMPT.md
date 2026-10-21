# Build a frontend-only staffing application prototype

## Mission

Start from scratch and build a polished, locally runnable, interactive prototype of a manager-facing employee absence and staffing application.

This is a client demonstration, NOT a production implementation.

The purpose is to validate:
- Screen layout.
- Navigation.
- The email-processing workflow.
- Staffing calendar visualization.
- Reviewing absence requests and their source emails.
- Approval interactions and coverage-impact presentation.

Think of this as a clickable product presentation with real widgets—not screenshots or static slides.

## Non-negotiable scope

Build ONLY the frontend.

DO NOT implement:
- A backend or API server.
- API calls or backend integration.
- Real authentication.
- Microsoft OAuth or Microsoft Graph.
- Real mailbox access.
- LLM calls, Ollama, or AI processing.
- Cloudflare configuration.
- A database.
- Real staffing or coverage calculations.
- Real email sending.
- Native iOS implementation.
- Production infrastructure.

“Zero logic” means zero business logic or integration logic.

Minimal local UI state IS required for navigation, opening panels, selecting dates, simulating progress, and changing mock statuses.

All data, processing results, staffing warnings, and coverage-impact figures must be predefined fixtures.

Do not accidentally build production functionality.

---

## Product context

Employees send absence requests to an Office 365 inbox.

A manager reviews those requests against the team's work schedule, understands potential staffing shortages, and decides whether to approve, decline, or request clarification.

Important distinctions:
- Processing an email is NOT approving an absence.
- A pending absence is NOT an approved absence.
- Absence requests are NOT meeting bookings.
- The calendar must represent employees and staffing, not just a generic appointment calendar.

The future production system will run on a home Mac mini with a Python backend and local AI, accessed remotely from an office browser.

None of that infrastructure belongs in this prototype.

---

## Technology

Use:
- React Native + Expo.
- Expo Router.
- TypeScript.
- Tamagui for shared UI components, layout, forms, dialogs, and panels.
- FullCalendar with its React integration for the web scheduling interface.

MVP 1 targets the browser only.

Use the current compatible package versions and verify official setup documentation as needed.

Do not add Next.js or an unnecessary second application framework.

### FullCalendar requirements

Use real FullCalendar rendering with:
- Resource timeline for the main weekly staffing board.
- Employees as resource rows.
- Dates/hours on the horizontal axis.
- A month overview.
- Previous / Today / Next controls.
- Event selection.

Resource timeline uses FullCalendar Premium:
- Keep the license configuration explicit and documented.
- Use an appropriate evaluation setup only where its terms permit.
- Do not fabricate a license key.
- Do not imply that evaluation licensing authorizes production use.
- If licensing prevents implementation, clearly report the blocker rather than silently substituting a static table.

Keep the scheduler in a web-specific component so a future iOS client can use a different native implementation.

Do not build the iOS scheduler now.

---

## Visual direction

Create a polished, credible business application.

Style:
- Light theme.
- Clean typography.
- Restrained navy/indigo primary color.
- Neutral backgrounds.
- Subtle borders and shadows.
- Clear spacing and visual hierarchy.
- Compact but readable staffing information.
- Consistent icons and status badges.

Communicate status using text/icons as well as color.

Use a temporary product name such as “StaffPlanner.”

Show a persistent, unobtrusive label:
“Demo mode · All data is fictional”

Prioritize desktop browser presentation at approximately 1440 × 900.

Make narrow screens usable, but do not spend time implementing a native mobile application.

---

## Required screens and interactions

### 1. Login

Include:
- Product logo/name.
- Short explanation of the product.
- Email field prefilled with a fictional manager address.
- Password field with a fictional masked value.
- Primary “Sign in to demo” button.
- Clear demo-mode notice.

Behavior:
- Clicking the button navigates directly to the home screen.
- Do not validate credentials.
- Do not contact any service.
- Do not build session management.

A sign-out control should return to this page.

### 2. Application shell

After login, display:
- Sidebar navigation:
  - Overview
  - Staffing calendar
  - Requests
  - Emails
  - Demo settings
- Header:
  - Page title.
  - Demo manager identity.
  - Demo-mode badge.
  - Reset demo action.
  - Sign out.

Every visible navigation item must work.

### 3. Home / overview

Display:
- Welcome message.
- Office 365 mailbox connection card.
- Summary cards:
  - Unprocessed emails.
  - Pending requests.
  - Approved absences.
  - Coverage warnings.
- Prominent “Process new emails” button.
- Recent activity.
- Brief schedule/coverage preview.

Mailbox card:
- Fictional shared mailbox address.
- Connected/disconnected demo status.
- “Connect Office 365” button when disconnected.
- Clicking connect opens a simulated connection dialog.
- Confirming the dialog changes the local display to connected.
- Clearly label the flow as simulated.

Do not create an OAuth page or ask for real credentials.

### 4. Simulated email processing

Clicking “Process new emails” must start a short, scripted demo.

Show progress stages such as:
1. Reading new emails.
2. Identifying absence requests.
3. Extracting requested time ranges.
4. Linking source evidence.
5. Updating the staffing board.

Implementation:
- Use local timers and predefined fixture transitions.
- Finish in approximately 5–8 seconds.
- Disable duplicate processing while running.
- Show a visible progress indicator.
- Keep the simulated job state alive when navigating between screens.
- Reveal predefined results on completion.
- Show a completion message with links to Requests and Staffing calendar.

Suggested batch:
- 12 emails processed.
- 7 absence-related messages.
- 4 unrelated messages.
- 1 message requiring clarification.
- 2 predefined coverage warnings.

Keep all displayed counts internally consistent.

After completion:
- Mark the fixture emails as processed.
- Display the illustrative Outlook category:
  `StaffPlanner-Processed`
- Update the dashboard from predefined post-processing fixtures.

Explain in a tooltip or helper text:
“Processed means reviewed by the app, not approved by a manager.”

If the user clicks Process again, show:
“No new emails in this demo. Reset the demo to replay.”

### 5. Staffing calendar

This is the main demonstration screen.

Use actual FullCalendar components—not an image, placeholder, or hand-drawn calendar.

Provide:
- Weekly employee resource timeline.
- Month overview.
- Previous / Today / Next navigation.
- Team filter.
- Employee filter.
- Status filter.
- Clear legend.
- Export button.

Show approximately 8 fictional employees and a representative baseline work schedule.

Visually distinguish:
- Scheduled work.
- Pending absence.
- Approved absence.
- Needs clarification.
- Coverage warning.

Prefer background blocks or other visually clear treatment for work shifts so absence overlays remain readable.

Use partial-day and full-day examples.

Do not overlay a declined request as though the employee is absent.

Add a coverage summary area with predefined warnings:
- Example: “Wednesday, 13:00–17:00: 1 person below minimum if pending requests are approved.”
- Label pending-request impacts as hypothetical.

Do not calculate coverage dynamically.

Clicking a request opens its details panel.

Do not enable drag-and-drop or resizing unless it is purely demonstrative and cannot imply that real shifts were saved.

### 6. Request detail panel

Open as a desktop side panel and a suitable modal/sheet on smaller screens.

Include:
- Employee name and role.
- Request status.
- Requested start/end.
- Full-day or partial-day label.
- Source email subject.
- Sender and received date.
- Supporting quote from the email.
- “View full email.”
- Related messages for an amendment or cancellation.
- Predefined “Impact if approved” section.

Example impact:
- Scheduled staff: 4.
- Available if approved: 3.
- Required minimum: 4.
- Shortfall: 1.
- Affected period: 13:00–17:00.

All values come from fixtures.

Actions:
- Approve.
- Decline.
- Needs clarification.

Actions may open a confirmation dialog and update the in-memory mock request status.

Reflect that status consistently across the requests list and calendar.

Do not implement policy checks, approval services, coverage recalculation, or actual notifications.

For amended or cancelled requests, show an explicit review action and contextual copy rather than blindly reusing a new-request approval flow.

Include a small fictional activity/history section.

### 7. Requests page

Provide a table or structured list with:
- Employee.
- Requested period.
- Request type.
- Status.
- Source email subject.
- Coverage indicator.
- Review action.

Filters:
- All.
- Pending.
- Approved.
- Declined.
- Needs clarification.

Use fixture-based client-side filtering only.

Clicking a row opens the shared request detail panel.

### 8. Emails page

Show fictional imported messages with:
- Sender.
- Subject.
- Received time.
- Processing status.
- Classification.
- App category.
- Linked request, if any.

Include:
- Processed relevant messages.
- Unrelated messages.
- One ambiguous message.
- At least one unread-but-processed example.

Read/unread and processing status must be visually separate.

Opening an email shows its full fictional text and highlights the supporting passage where practical.

No real mailbox is accessed.

### 9. Export demo

Provide export controls for:
- Approved absences.
- Work schedule.
- Format: CSV or ICS.

For this prototype:
- Download clearly named, static sample files from local assets.
- Label them “Sample export—not a live export of your selections.”
- Do not implement real export generation or calendar synchronization.

### 10. Demo settings

Keep this minimal:
- Explanation that the prototype has no backend.
- Fictional mailbox details.
- Display-only timezone.
- Reset demo button.
- Brief list of simulated features.

Do not build a production settings system.

---

## Fixture scenarios

Create realistic but fictional data covering:

1. Straightforward full-day absence request.
2. Partial-day absence.
3. Multiple dates in one email.
4. Ambiguous date requiring clarification.
5. Amendment to an earlier request.
6. Cancellation of an earlier request.
7. Unrelated workplace email.
8. Request with a predefined staffing shortfall.
9. Request without a staffing shortfall.
10. Multiple source emails supporting one request.

Ensure:
- Email counts and dashboard counts agree.
- Employees match the roster.
- Timeline blocks match request dates.
- Source snippets match the fictional email bodies.
- Request updates do not create duplicate active absences.

Use one centrally defined demo week and displayed timezone.

The calendar must open on that demo week so it never appears empty merely because the real date changed.

Provide a “Demo week” control to return to it.

---

## Suggested organization

Keep responsibilities separated, for example:

- `app/` — Expo Router routes and layouts.
- `src/components/` — reusable UI.
- `src/features/dashboard/`
- `src/features/mailbox/`
- `src/features/requests/`
- `src/features/scheduling/`
- `src/demo/` — fixtures, demo state, scripted transitions.
- `src/theme/` — Tamagui configuration and design tokens.
- `public/` — static sample export files.

Use a small shared in-memory demo-state provider.

Do not add:
- API abstractions with fake network calls.
- Repository/service layers for a nonexistent backend.
- A global state framework unless clearly necessary.
- Local database storage.
- Production authentication scaffolding.

Local UI state should reset on reload, and an explicit Reset demo action should restore the starting state without requiring a reload.

Keep reset behavior safe if a simulated processing timer is running.

---

## Accessibility and quality

- Use labeled inputs and accessible buttons.
- Make dialogs and navigation keyboard usable.
- Preserve readable contrast.
- Avoid color-only meaning.
- Make every visible action functional or explicitly labeled as a demo.
- Avoid dead navigation, empty placeholder pages, and misleading success messages.
- No real employee information or credentials.
- No secrets or license keys committed to source.
- No application API requests.

---

## Implementation priorities

1. Get the Expo web application running.
2. Establish Tamagui theme and application shell.
3. Build demo fixtures and shared state.
4. Complete login → home navigation.
5. Implement simulated mailbox connection and email processing.
6. Build the real FullCalendar staffing board.
7. Connect the request panel and fixture status changes.
8. Add request and email views.
9. Add sample exports and reset behavior.
10. Polish responsiveness, accessibility, and consistency.

Prefer a complete end-to-end demo over numerous unfinished features.

---

## Acceptance criteria

The prototype is complete when I can:

1. Install dependencies and run it locally using documented commands.
2. Open the login page.
3. Click Sign in to demo without authentication.
4. Simulate connecting the Office 365 mailbox.
5. Click Process new emails and watch progress.
6. See the predefined imported emails and processing outcomes.
7. Open a populated weekly employee timeline.
8. Switch to a month overview.
9. Select an absence request and read its source-email evidence.
10. Approve, decline, or request clarification using local demo state.
11. See consistent status changes across screens.
12. Download clearly labeled static sample exports.
13. Reset and replay the complete demonstration.

All this must work without backend services, credentials, Ollama, or real email.

---

## Deliverables

Deliver working source code, not just a plan.

Include a README explaining:
- Required runtime versions.
- Dependency installation.
- Exact command to start the local web app.
- Any FullCalendar evaluation/license setup.
- How to run the demonstration.
- What is simulated.
- What is intentionally not implemented.
- That native iOS is future work.

Run available checks and test the main demo path.

At completion, summarize:
- What was built.
- How to launch it.
- Any unresolved limitations.
- License considerations.
- Which checks were actually run.

Do not claim that untested functionality works.