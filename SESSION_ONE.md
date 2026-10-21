# Session One — VTU Solve Frontend Build

**Date:** 2026-10-18
**Project:** VTU Solve — AI exam-preparation web app for VTU (Visvesvaraya Technological University) students
**Scope of this session:** Build the **complete frontend**, running entirely on **mock data**. No backend, database, OCR engine, API keys, or scraping. All future server calls isolated behind one file: `src/api/client.js`.
**Outcome:** ✅ All 17 planned tasks completed and verified. App builds and runs cleanly.

---

## 1. Product summary

A student picks **scheme → branch → semester → subject**, then **types or photographs a question**, and gets an **exam-format answer** tagged with its **module number** and **marks type** (5M / 10M).

---

## 2. Tech stack used

- **Vite** + **React 18** (JavaScript, not TypeScript)
- **React Router v6** (routing)
- **Tailwind CSS 3.4** (dark theme, semantic design tokens)
- **Framer Motion 11** (springs, shared-layout, scroll reveal)
- **lucide-react** (icons)
- React **Context** + **localStorage** (auth, profile, notes, history, usage)
- No other UI libraries.

**Environment notes (Windows):**
- Node v26.5.0, npm 12.0.1.
- PowerShell shell — use `;` not `&&` to chain commands.
- `npm` can't be launched via `Start-Process` directly; use `node node_modules/vite/bin/vite.js` to run vite in the background.
- esbuild's postinstall was blocked by npm 12's allowScripts policy, but builds work fine (prebuilt binary).

---

## 3. Requirements decisions confirmed with the user (before building)

These were agreed in the planning conversation and drove the implementation:

| # | Topic | Decision |
|---|-------|----------|
| 1 | Email validation | Accept **any valid email format** today. A placeholder `ALLOWED_DOMAINS` constant is kept in code (shown as "coming soon" guidance) but **not enforced**. |
| 2 | New vs returning user | **Every login routes to `/onboarding`** in this mock phase. |
| 3 | Usage meter & data persistence | Daily counter **persists in localStorage, resets at midnight** (date-stamped). Notes & History **persist indefinitely**. |
| 4 | OCR confidence & answer matching | Canned answers chosen by **case-insensitive keyword match**. OCR confidence is **fixed/deterministic** per fixture (not randomized). |
| 5 | Daily limit (30/day) | **No real enforcement** — the "7/30" meter is purely a visual display; submit is never blocked. |
| 6 | PYQ linking | "asked N times" counts are **static/hardcoded** in `mockPyqs.js`. Solver's "Similar PYQs" passes **`subject` + `module` query params**, read by the PYQ Bank FilterBar on mount. |
| 7 | Delivery scope | **All 8 pages** built in one pass. |
| 8 | Landing demo card | Driven by the **real mock `solveQuestion` client** on a loop, reusing the same loading/progress/streaming states as the Solver. |
| 9 | Research check | Researched **accessible streaming-text patterns** and **Tailwind dark-theme token conventions** before finalizing. |

### Research findings applied
- **Streaming text accessibility:** Never put `aria-live` on the token-by-token container (causes screen-reader "noise"). Instead render the **full text immediately** in a visually-hidden element for assistive tech, make the animated typewriter layer `aria-hidden`, and announce only **milestones** ("Solving…", "Answer ready") via a separate polite live region.
- **Tailwind tokens:** Define semantic color tokens once in `tailwind.config.js` under `theme.extend.colors`; components reference token classes only, never raw hex.

---

## 4. Design system

**Colors (semantic tokens in `tailwind.config.js`):**

| Token | Hex | Use |
|-------|-----|-----|
| `background` | `#0B0D12` | Page background |
| `surface` | `#12151C` | Cards |
| `elevated` | `#181C26` | Raised elements |
| `border` | `#1F2430` | 1px borders |
| `text` | `#E6E8EE` | Primary text |
| `muted` | `#8A91A3` | Secondary text |
| `accent.from` → `accent.to` | `#7C5CFF` → `#22D3EE` | Primary gradient (violet → cyan) |
| `success` / `warning` / `danger` | `#34D399` / `#FBBF24` / `#F87171` | States |

**Fonts (Google Fonts):** Space Grotesk (headings), Inter (body), JetBrains Mono (codes / key terms).
**Other:** 16px card radius, 1px borders, soft glow shadow on hover, glass (backdrop-blur) navbar & modals. Framer Motion springs (stiffness 300, damping 30). All animation respects `prefers-reduced-motion`. Responsive from 360px; mobile bottom tab bar; 44px minimum tap targets.

---

## 5. Build order & task log (all ✅ complete)

### Task 1 — Project scaffold & design tokens
- Created `vite.config.js`, `package.json` (pinned deps), `postcss.config.js`, `tailwind.config.js` (all semantic tokens, fonts, `radius card=16px`, `shadow-glow`, `bg-accent-gradient`, keyframes `shake`/`caret`/`scanline`/`float`).
- `index.html` with Google Fonts preconnect + link.
- `src/index.css` — Tailwind layers, base theme, utilities (`.glass`, `.btn-primary`, `.btn-secondary`, `.card`, `.tap-target`, `.text-gradient`), global focus rings, themed scrollbar, reduced-motion media query.
- `src/hooks/useReducedMotion.js`, `src/main.jsx`, temporary `src/App.jsx`.
- **Verified:** `npm install` OK; `npm run build` succeeds.

### Task 2 — App shell (routing, Navbar, BottomTabs)
- `src/App.jsx` — `BrowserRouter` + `Routes` wrapping `Layout`, 8 routes.
- `src/components/Layout.jsx` — Navbar + `Outlet` + conditional BottomTabs (only on `/solve`, `/pyqs`, `/notes`, `/history`) + scroll-to-top on route change.
- `src/components/Navbar.jsx` — glass sticky; on `/` shows anchor links (`#how`, `#features`, `#faq`) + "Get started"; elsewhere shows app tabs with shared-layout underline (`layoutId="navbar-underline"`).
- `src/components/BottomTabs.jsx` — fixed mobile bar (`md:hidden`), `layoutId="bottomtabs-underline"`, 44px tap targets.
- `src/components/navConfig.js` — `APP_TABS` [Solve, PYQs, Notes, History].
- All 8 stub pages created in `src/pages/`.

### Task 3 — Academic mock data
- `src/data/academics.js`:
  - `SCHEMES` (6: 2015/2017/2018/2021/2022/2025, each `{id,label,years}`)
  - `BRANCHES` (14: CSE, ISE, AIML, AIDS, ECE, EEE, ME, CV, Aerospace, Automobile, Biotechnology, Chemical, Biomedical, Telecommunication)
  - `SEMESTERS` [1..8]
  - `getSubjects(scheme, branch, semester)` → 4–6 subjects `{code, name, modules:5}`. **Realistic CSE names for semesters 3–6**; generic placeholder list otherwise. All codes are placeholders (e.g. `XXX501`, branch-prefixed like `ECE301`).
- **Verified:** CSE sem5 → DBMS/Computer Networks/etc; ECE sem3 → generic list.

### Task 4 — Mock API client + mock data
- `src/data/mockAnswers.js`:
  - `CANNED_ANSWERS` (**6 total**: normalization, deadlock, TCP handshake, stack, OOP, Dijkstra) — **2×5M + 4×10M** (verified). Each has `keywords`, `subjectHint`, `module`, `marks`, `answerPoints`, `keyTerms`, `diagramHint`, `sources`.
  - `GENERIC_ANSWER` fallback.
  - `OCR_FIXTURES` (3, deterministic, including one **low-confidence 0.63** to trigger the warning).
- `src/data/mockPyqs.js`: `MOCK_PYQS` (8 items with **static `askedCount`**, year, module, marks, answerPoints) + `PYQ_YEARS` / `PYQ_MODULES` / `PYQ_MARKS`.
- `src/api/client.js` — the **single swappable API seam**. Functions (all async with realistic delay, each marked `// MOCK - replace with fetch to backend`):
  - `solveQuestion`, `runOcr`, `getPyqs`, `saveNote`, `getNotes`, `getHistory`, `sendFeedback`, `login`.
  - `solveQuestion` keyword-matches a canned answer and resolves the subject via `getSubjects`. `runOcr` cycles fixtures deterministically.

### Task 5 — Contexts + storage
- `src/lib/storage.js` — `loadJSON` / `saveJSON` / `removeKey` / `todayKey` (YYYY-MM-DD for midnight reset).
- `src/context/AuthContext.jsx` — `useAuth`: `user`, `isAuthed`, `signIn`, `signOut` (key `vtusolve.auth`).
- `src/context/ProfileContext.jsx` — `useProfile`: `profile`/`hasProfile`/`saveProfile`/`updateProfile`, `notes`+`addNote`/`removeNote`/`restoreNote`, `history`+`addHistory` (max 50), `usage`+`incrementUsage` (midnight reset), `DAILY_LIMIT=30` (cosmetic). Keys: `vtusolve.profile` / `.notes` / `.history` / `.usage`.
- `src/main.jsx` provider tree: `AuthProvider > ProfileProvider > ToastProvider > App` (ErrorBoundary added in Task 16).

### Shared primitive components (built across Tasks 6–12 as needed)
- `Chip.jsx` (active/mono/`as` variants), `Accordion.jsx` (animated height, `aria-expanded`/`aria-controls`), `Skeleton.jsx`, `Toast.jsx` (`ToastProvider`+`useToast`, portal, supports undo action, types success/warning/info), `Reveal.jsx` (scroll-reveal), `TabSwitch.jsx` (role=tablist, shared-layout underline), `ProgressSteps.jsx` (exports `SOLVE_STEPS`), `StreamingText.jsx` (accessible typewriter), `ErrorBoundary.jsx`.
- `src/hooks/useCountUp.js` (IntersectionObserver + rAF easeOutCubic, respects reduced-motion).

### Task 6 — Landing page (static sections)
`src/components/landing/`: `AnimatedBackground` (float orbs + faint grid, aria-hidden), `Hero` (gradient headline, "Try it free" → `/login`, "See how it works" → `#how`), `HowItWorks` (#how, 3 steps), `Features` (#features, 6 cards, hover lift+glow), `Stats` (count-up 6/14/8 on scroll), `Faq` (#faq, 6 Qs including the **"Is this for cheating?"** policy answer), `Footer`. `src/pages/Landing.jsx` assembles them.

### Task 7 — Landing live demo card
`DemoCard.jsx` — **self-looping**, calls the real `solveQuestion` with a fixed DBMS normalization question. Phases: TYPING (char-by-char) → SOLVING (`ProgressSteps`) → ANSWER (`StreamingText` first point + Module/marks Chips). **Pauses on hover**, then loops. `role="img"` + descriptive `aria-label`.

### Task 8 — Login page
`src/pages/Login.jsx` — glass card, `TabSwitch` Email/USN. `EMAIL_RE` general format (any email accepted); `USN_RE = /^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$/` (verified `1AB22CS001` passes). `ALLOWED_DOMAINS` shown as "coming soon" (not enforced). Live validation, **shake on invalid submit**, fake magic link (status idle→sending→sent), `signIn()`, then `navigate('/onboarding')`. USN input auto-uppercases, maxLength 10, mono.

### Task 9 — Onboarding wizard
`src/pages/Onboarding.jsx` — 3 steps (Scheme timeline cards / Branch icon grid / Semester chips), animated progress bar, Back/Next (Next disabled until a selection), keyboard-friendly, `aria-pressed`. Finish → `saveProfile({scheme,branch,semester,subjectCode:null})` → `navigate('/solve')`. AnimatePresence slide between steps.

### Tasks 10–13 — Solver (the core screen)
- `SubjectSelector.jsx` — pill bar (Scheme · Branch · Sem · Subject); each pill opens a popover listbox (click-outside + Esc to close); subjects cascade via `getSubjects`; auto-selects first subject; changing scheme/branch/sem resets `subjectCode`.
- `QuestionInput.jsx` (Type tab) — textarea maxLength 300, live counter (warns >90%), Ctrl/Cmd+Enter submit, 4 example chips that fill the box.
- `OcrPreview.jsx` — editable textarea + confidence badge (green ≥70%, amber <70%) + low-confidence `role="alert"` warning.
- `PhotoInput.jsx` (Photo tab) — drag-and-drop + camera button, thumbnail, 1.5s fake OCR with scanning-line animation, then `OcrPreview`; edited text lifted via `onText`; object URLs revoked on reset.
- `AnswerCard.jsx` — header Chips (Module / marks / code) + subject name; numbered points revealed one animated row at a time (via `StreamingText.onDone`); diagram hint; key-term mono chips; footer: Copy (clipboard + toast), Save to notes, Ask follow-up (inline input), Similar PYQs (`navigate('/pyqs?subject=…&module=…')`), 3-button rating (perfect/partly/wrong) with a Wrong→feedback box; all call `sendFeedback`.
- `RecentQuestions.jsx` — last 5 from history, `onRerun`, empty state.
- `UsageMeter.jsx` — slim animated bar `count/limit`, "Resets at midnight", display-only.
- `src/pages/Solver.jsx` — redirects to `/onboarding` if no profile; `SubjectSelector` on top; grid `lg:[1fr_20rem]` (right column stacks below on mobile); `TabSwitch` Type/Photo; Get answer button disabled when empty/solving; `handleSolve` runs timed progress steps → `solveQuestion` → AnswerCard, then `incrementUsage` + `addHistory`; error state with Retry; reads `?q=` param to prefill (used by History re-run).

### Task 14 — PYQ Bank
- `FilterBar.jsx` — 7 selects (scheme/branch/sem/subject/year/module/marks), each with an "Any" option; subject cascades; "Clear all" (disabled when no filters).
- `PyqCard.jsx` — click to expand (animated height); Chips (code/module/marks) + year badge + "asked N×" badge; shows answer points.
- `src/pages/PyqBank.jsx` — `useSearchParams`, `fromParams()` seeds filters from the URL (the Solver link), fetches `getPyqs` on filter change and keeps the URL in sync; 4 skeleton cards while loading (600ms); empty state with reset; results grid (md: 2 columns) with a count.

### Task 15 — My Notes & History
- `src/pages/Notes.jsx` — "Export all" (.txt Blob download), search box (subject name/code/answer text), groups by subject code into `Accordion` (default open) with counts; each note shows Module/marks Chips + delete → `removeNote` + **undo toast** (`restoreNote`); empty + no-match states.
- `src/pages/History.jsx` — `relativeTime()` helper (just now / Nm / Nh / Nd ago), reverse-chronological list, each item has question + code/module/marks Chips + time + Re-run button → `navigate('/solve?q=…')`; empty state.

### Task 16 — Error/empty states, accessibility & polish
- `ErrorBoundary.jsx` (class component, friendly fallback + Reload button) wrapped at the top of the provider tree.
- Solver got a visually-hidden `role="status" aria-live="polite"` **milestone announcer** (Solving / Answer ready / error) — not the streaming text itself (per research).
- A11y audit: all icon-only buttons have `aria-label` (remove image, dismiss toast, delete note); decorative icons `aria-hidden`; `StreamingText` has full `sr-only` text; global `:focus-visible` rings; global reduced-motion media query; `TabSwitch` role=tablist/tab + `aria-selected`; Accordion/PyqCard `aria-expanded`/`aria-controls`; Onboarding buttons `aria-pressed`. Every page has loading / empty / error states.

### Task 17 — README & final wiring
- `README.md` written: install/run, try-it walkthrough, folder map, routes table, design-token table, **"How to swap the mock API for the real backend"** (full API contract + a before/after `solveQuestion` example), local-data notes, accessibility notes.
- Confirmed every page is reachable, no orphaned components, and **no file exceeds 250 lines** (largest: `AnswerCard.jsx` at 232).

---

## 6. Verification evidence

- `npm run build` → **succeeds**, 1911 modules transformed, no errors. Output: `index.html` 1.13 kB, CSS 22.88 kB (gzip 5.17), JS 372.32 kB (gzip 115.48).
- `npm run dev` (exact README command) → **ready in ~858ms**, serves **HTTP 200**, no error logs.
- Production `preview` server → HTTP 200 on `/` (root div + title present) and HTTP 200 on deep route `/pyqs` (SPA fallback works).
- Node runtime checks confirmed: `getSubjects` behavior, 6 canned answers (2×5M/4×10M), keyword match + generic fallback, 3 OCR fixtures incl. 0.63 low-confidence, 8 PYQs, USN/email regexes.

---

## 7. Final folder structure

```
vtu-solve/
├─ index.html
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.js
├─ README.md
├─ public/
│  └─ favicon.svg
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ index.css
   ├─ api/client.js            ← the ONLY "server" (mock)
   ├─ data/academics.js, mockAnswers.js, mockPyqs.js
   ├─ context/AuthContext.jsx, ProfileContext.jsx
   ├─ hooks/useReducedMotion.js, useCountUp.js
   ├─ lib/storage.js
   ├─ components/
   │  ├─ Navbar, BottomTabs, Layout, navConfig
   │  ├─ SubjectSelector, QuestionInput, PhotoInput, OcrPreview
   │  ├─ ProgressSteps, StreamingText, AnswerCard
   │  ├─ FilterBar, PyqCard
   │  ├─ Chip, Toast, Skeleton, Accordion, TabSwitch
   │  ├─ Reveal, RecentQuestions, UsageMeter, ErrorBoundary
   │  └─ landing/ (AnimatedBackground, Hero, DemoCard, HowItWorks, Features, Stats, Faq, Footer)
   └─ pages/
      ├─ Landing, Login, Onboarding
      ├─ Solver, PyqBank, Notes, History
      └─ NotFound
```

**Routes:** `/` Landing · `/login` · `/onboarding` · `/solve` Solver · `/pyqs` PYQ Bank · `/notes` · `/history` · `*` 404.

---

## 8. Known placeholders / notes for the next session

- **Subject codes are placeholders** (`XXX501`, `ECE301`, etc.) — drop real VTU syllabus data into `src/data/academics.js`. Only CSE semesters 3–6 have realistic subject *names*; everything else is a generic list.
- **No real backend** — replace each function body in `src/api/client.js` (keep return shapes identical; each is marked `// MOCK - replace with fetch to backend`).
- **College-email domain enforcement** is scaffolded (`ALLOWED_DOMAINS`) but intentionally **not enforced** yet — tighten validation in `src/pages/Login.jsx` when ready.
- Notes/history/usage currently live in **localStorage** (`vtusolve.*` keys); can be moved server-side later by changing only `ProfileContext` + `client.js`.
- Dependencies have some audit warnings (transitive, dev-only via Vite 5 toolchain) — not addressed this session; revisit if upgrading.

---

## 9. How to resume next session

1. `npm install` then `npm run dev` → open http://localhost:5173.
2. Read `README.md` → "How to swap the mock API for the real backend".
3. Likely next steps: real syllabus data, real backend wiring in `client.js`, real OCR, real auth, and tightening email-domain validation.

*Built for exam preparation — not for use during exams.*
