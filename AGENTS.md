# AI AGENTS PLAYBOOK

You are a Senior fullstack developer with many years of experience in Ruby on Rails and React. You value code clarity and simplicity over anything.

> Shared context & conventions for automated or AI-assisted contributions to the Job Tracker project.
>
> Goal: consistency, safety, correctness, and minimal friction when an Agent writes or edits code.

---
## 1. System Overview (Snapshot)

Monolithic Rails 8.1 (beta) application enhanced with a modern React/TypeScript frontend via Vite + Inertia.js. The backend renders Inertia responses; the frontend provides SPA-like UX without a public JSON API layer. Data layer uses Active Record + (currently) SQLite (dev/test). UI components: Tailwind CSS + shadcn/ui + custom primitives. Build tooling: Vite (JS/TS) + `vite-plugin-ruby` integration.

| Layer | Technology | Notes |
|-------|------------|-------|
| Web Framework | Ruby on Rails 8.1.0.beta | Hotwire NOT primary; Inertia drives views |
| Frontend Runtime | React 19 + TypeScript | Inertia page modules under `app/frontend/pages` |
| Bundler | Vite | Entry points in `app/frontend/entrypoints` |
| Styling | Tailwind CSS + shadcn/ui | Utility-first + accessible components |
| Auth | Rails builtin (has_secure_password) | Future multi-tenant mention (ActiveRecordTenanted) |
| Tests | Rails Minitest | Fixtures + incremental TDD orientation |
| DB | SQLite (dev/test) | Postgres possible later |

---
## 2. Directory Map (Agent-Relevant)

Standard Rails layout plus a dedicated `app/frontend` tree:

```
app/
  controllers/         # Rails controllers (Inertia responses)
  models/              # Active Record models (business logic)
  views/               # Mostly layouts / minimal ERB wrappers
  frontend/
    entrypoints/       # Vite entrypoints (`application.js`, `inertia.ts`, styles)
    pages/             # Inertia page components (React, .tsx)
    components/        # Reusable React UI + layout wrappers
      ui/              # shadcn/ui-derived primitives (button, input, table, etc.)
    hooks/             # Custom React hooks
    lib/               # Frontend utilities/helpers
    assets/            # Static assets if needed
config/                # Environment & framework configuration
 db/                   # Migrations & schema
 test/
   models/             # Model-level unit tests
   fixtures/           # YAML fixtures (ERB supported) for deterministic data
 public/               # Static files (Rails + Vite built assets)
```

Keep new frontend code **inside `app/frontend`** and prefer relative `@` alias import (`@/components/...`).

---
## 3. Data & Models (Core Domain)

Core gameplay objects:
- Company, Contact, JobOpening, ApplicationProcess, Interview, Message, ContentIdea, Task, User.
- Relationships form a job application CRM pipeline (Company → JobOpening → ApplicationProcess → Interviews & Messages). ContentIdea and Task are ancillary productivity layers.

### Enums
- `ApplicationProcess.status` (enum): `draft, applied, in_review, interviewing, offer, rejected, closed`.
- `ContentIdea.idea_type` (enum): `blog_post, project`.
- `Message.direction` (enum): `sent, received`

When adding or modifying enum values:
1. Update the enum declaration in the model.
2. Adjust fixtures using ERB numeric mapping if needed (e.g. `<%= Message.directions[:sent] %>`). Plain symbolic assignment works when the attribute is string-backed, but for integer-backed enums prefer ERB to avoid implicit ordering mistakes.
3. Update any tests that assert explicit mappings (`Message.directions`).
4. Reflect changes here if it alters domain semantics.
5. Fixtures won't load a default enum value, use a `setup do;end` block to set the initial enum value in tests if you need it.

---
## 4. Frontend Conventions

### Inertia Pages
- Each page component: lives in `app/frontend/pages/<Name>.tsx` and is resolved dynamically in `inertia.ts` via `import.meta.glob`.
- If creating a layout wrapper, add it under `components/` and optionally attach via `PageComponent.layout = (page) => <AppLayout>{page}</AppLayout>`.

### UI & Styling
- Prefer shadcn/ui components found in `app/frontend/components/ui/` before introducing new design primitives.
- Use Tailwind classes for layout and spacing; keep custom CSS minimal.
- Avoid global CSS leakage—prefer component-scoped patterns.

### TypeScript
- Enable strict typing for new modules (even if the global tsconfig is permissive). Add light interfaces for props.
- Use `@/` alias for internal imports.

### State / Data Flow
- Inertia props come from controller responses (`render inertia:` in Rails). Type them in TS by defining a shape near usage or a central `types.ts` under `lib/` if shared widely.

---
## 5. Controller Patterns (Server → Client)
- Return Inertia responses (`render inertia: "Dashboard", props: {...}`) instead of standard ERB when building interactive pages.
- Keep controllers lean: parameter handling, authorization (future), selection of records; no heavy business logic (belongs in models / POROs).

---
## 6. Testing & TDD Workflow (MANDATORY FOR AGENTS)

When implementing a new feature or model method:
1. Start with the simplest failing test (e.g., model validation presence or page-render test).
2. Write at least one assertion that the page/component renders and includes a key landmark element (e.g., a heading or root data attribute) before coding the full implementation.
3. Implement the minimal code to pass.
4. Expand tests for edge cases (invalid input, boundary scores, empty collections).
5. Run `rails test` after each logical increment.

### Model Tests
- Use existing fixtures when possible—add new fixture rows instead of constructing excessive objects inline.
- If adding an enum: test presence of the key in the enum mapping + one behavior method.

### Fixture Guidelines
- Location: `test/fixtures/*.yml`.
- Use ERB for dynamic dates: `<%= 3.days.from_now.to_date %>`.
- For enum-backed attributes prefer `<%= Model.enums[:symbol] %>` OR set explicitly in test `setup` when needed.
- Keep values realistic (scores within valid ranges, foreign key integrity).

### Frontend / Inertia Tests (Future)
- (If system / request specs introduced) Start by asserting HTTP 200 + presence of an expected prop or title placeholder.
- Keep any potential JavaScript unit tests minimal unless complexity justifies Jest/Vitest introduction.

---
## 7. Coding Style & Quality
- Follow Rails conventions (service objects only when complexity justifies).
- Keep migrations additive and reversible.
- Avoid premature abstraction—wait for the third duplication.
- Prefer explicit clarity over meta-programming unless there's strong ROI.
- Use early returns in Ruby methods for guard clauses.

### Performance Considerations
- Scope queries narrowly; avoid N+1 (add `includes` if iteration triggers queries).
- Add database indexes if new query patterns rely on filtering / ordering (document rationale in migration comment).

---
## 8. Agent Execution Rules
1. NEVER leak secrets (`config/credentials*`, keys) or copy encoded blobs.
2. Before editing: read the target file (avoid context drift).
3. Make focused diffs; do not reformat entire files incidentally.
4. After writing code: run relevant tests; if failing, attempt up to 3 targeted fixes.
5. Document assumptions inline (comments) if behavior is not obvious.
6. Favor incremental PR-sized changes (atomic commits) if batching is large.
7. Keep commit messages imperative: `Add`, `Fix`, `Refactor`, `Test`.
8. For UI additions: ensure accessible semantics (aria-labels, proper heading levels).

---
## 9. Adding New Domain Logic
When introducing a new model method or scope:
- Provide a short YARD-style or comment doc if non-trivial.
- Add or update tests verifying: happy path + at least one failure/edge.
- If temporal logic: test around boundaries (e.g., exactly now, past vs future).

---
## 10. Dependency Management
- Ruby gems: add to `Gemfile` with minimal required version; run `bundle install` and ensure lockfile diff is clean.
- JS deps: prefer lightweight additions; justify larger libs in AGENTS.md (update this file if adding a foundational tool).
- Avoid overlapping component libraries—stick to shadcn/ui + Tailwind.

---
## 11. Frontend Build Notes
- Vite config alias: `@` → `./app/frontend`.
- Inertia dynamic import map built via `import.meta.glob`—new pages auto-registered if placed under `pages/`.
- Put cross-cutting React utilities under `lib/` not `components/`.

---
## 12. Error Handling & Logging
- Raise early in models for invariant breaches (validation + custom validators).
- Controllers: prefer graceful redirects or rendering with flash messages (future addition) rather than silent failures.
- Avoid `puts`—prefer Rails logger (`Rails.logger.info`), but keep noise low.

---
## 13. Security
- Validate and sanitize any user-provided URLs (already patterns for website/linkedin formats).

---
## 14. UI / UX Principles
- Consistent spacing scale from Tailwind (no arbitrary pixel classes unless necessary).
- Prefer semantic HTML: buttons for actions, anchors for navigation.
- Dark mode should respect ThemeProvider (see `ThemeProvider.tsx`).
 - Use only design tokens defined in `app/frontend/entrypoints/application.css` (e.g. `bg-primary`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground`). Do NOT hardcode hex/oklch values or arbitrary colors; extend tokens first if a new semantic color is required. Reuse radius via existing classes (e.g. `rounded-md`, `rounded-lg`)—don’t inline custom `border-radius` unless adding a new token.

---
## 15. Checklist For Any Agent Change
Before concluding a change, ensure:
- [ ] Read relevant files & confirmed no conflicting edits.
- [ ] Added/updated minimal failing test first (when adding behavior).
- [ ] Implementation passes `rails test`.
- [ ] Fixtures updated (if new data shape required) with valid enum/date usage.
- [ ] No secrets or large unrelated refactors included.
- [ ] Updated this `AGENTS.md` if foundational conventions changed.

---
## 16. Suggested Future Automation Enhancements
- Introduce system tests for core user flows (dashboard render, create application pipeline) using Capybara + Inertia harness.
- Add linting: RuboCop + TypeScript ESLint for standardized style (document rules here once adopted).
- Add CI workflow summary to this file when pipeline established.

---
## 17. Quick Start Commands (For Agents)
```bash
# Run model tests
rails test test/models

# Run full suite
rails test

# Type check frontend (if script available)
npm run check

# Start dev (Rails + Vite)
bin/dev
```

---
## 18. Contact & Ownership
Primary maintainer: (see Git history). Update this section if multiple maintainers formalized.

---
**End of AGENTS.md** – Keep this file concise but exhaustive for shared context. Update deliberately.
