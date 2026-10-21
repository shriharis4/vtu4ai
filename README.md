# VTU Solve

An AI exam-preparation web app for students of Visvesvaraya Technological
University (VTU), Karnataka.

> Pick your scheme, branch, semester and subject, type or photograph a question,
> and get an exam-format answer tagged with its module number and marks type.

**This is a frontend-only build running entirely on mock data.** There is no
backend, database, OCR engine or AI model today. Everything that will later come
from a server is isolated behind a single file — `src/api/client.js` — so the
real backend can be dropped in without touching any component.

---

## Tech stack

- **Vite** + **React 18** (JavaScript)
- **React Router v6** for routing
- **Tailwind CSS** for styling (dark theme, semantic design tokens)
- **Framer Motion** for animation (springs, shared-layout, scroll reveal)
- **lucide-react** for icons
- React **Context** + **localStorage** for auth, profile, notes and history

No other UI libraries are used.

---

## Install and run

Requires **Node.js 18+** and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (hot reload)
npm run dev
```

Then open the URL Vite prints (default **http://localhost:5173**).

Other scripts:

```bash
npm run build     # Production build into dist/
npm run preview   # Serve the production build locally
```

### Try it out

1. On the landing page click **Try it free** → you land on **Login**.
2. Enter any email (e.g. `you@college.ac.in`) or a USN like `1AB22CS001`, then
   send the magic link. You are routed to **Onboarding**.
3. Pick a scheme, branch and semester → you land on the **Solver**.
4. Type a question (try the example chips) or switch to the **Photo** tab and
   upload any image to see the OCR flow. Click **Get answer**.
5. Save answers to **Notes**, revisit them in **History**, or browse the
   **PYQ bank**. The **Similar PYQs** button on an answer deep-links into the
   PYQ bank with filters pre-applied.

> Tip: questions mentioning *normalization*, *deadlock*, *TCP handshake*,
> *stack*, *OOP* or *Dijkstra* match the canned answers; anything else returns a
> sensible generic answer.

---

## Folder map

```
vtu-solve/
├─ index.html                 # Entry HTML + Google Fonts
├─ tailwind.config.js         # Semantic colour tokens, fonts, motion
├─ postcss.config.js
├─ vite.config.js
└─ src/
   ├─ main.jsx                # App bootstrap + provider tree
   ├─ App.jsx                 # Router with all 8 routes
   ├─ index.css               # Tailwind layers + utility classes
   │
   ├─ api/
   │  └─ client.js            # ★ THE ONLY "server" — mock API (swap this)
   │
   ├─ data/
   │  ├─ academics.js         # Schemes, branches, semesters, getSubjects()
   │  ├─ mockAnswers.js       # Canned answers + OCR fixtures
   │  └─ mockPyqs.js          # Previous-year questions
   │
   ├─ context/
   │  ├─ AuthContext.jsx      # Mock session (localStorage)
   │  └─ ProfileContext.jsx   # Profile, notes, history, daily usage
   │
   ├─ hooks/
   │  ├─ useReducedMotion.js
   │  └─ useCountUp.js
   │
   ├─ lib/
   │  └─ storage.js           # localStorage helpers + daily date key
   │
   ├─ components/
   │  ├─ Navbar.jsx  BottomTabs.jsx  Layout.jsx  navConfig.js
   │  ├─ SubjectSelector.jsx  QuestionInput.jsx  PhotoInput.jsx  OcrPreview.jsx
   │  ├─ ProgressSteps.jsx  StreamingText.jsx  AnswerCard.jsx
   │  ├─ FilterBar.jsx  PyqCard.jsx
   │  ├─ Chip.jsx  Toast.jsx  Skeleton.jsx  Accordion.jsx  TabSwitch.jsx
   │  ├─ Reveal.jsx  RecentQuestions.jsx  UsageMeter.jsx  ErrorBoundary.jsx
   │  └─ landing/             # Hero, DemoCard, HowItWorks, Features, Stats, Faq, Footer
   │
   └─ pages/
      ├─ Landing.jsx  Login.jsx  Onboarding.jsx
      ├─ Solver.jsx  PyqBank.jsx  Notes.jsx  History.jsx
      └─ NotFound.jsx
```

### Routes

| Path          | Page        | Notes                                        |
| ------------- | ----------- | -------------------------------------------- |
| `/`           | Landing     | Hero with a self-running live demo card      |
| `/login`      | Login       | Email / USN tabs, fake magic link            |
| `/onboarding` | Onboarding  | 3-step scheme / branch / semester wizard     |
| `/solve`      | Solver      | The core screen (redirects if no profile)    |
| `/pyqs`       | PYQ bank    | Reads `?subject=&module=` query params       |
| `/notes`      | My Notes    | Saved answers grouped by subject             |
| `/history`    | History     | Re-run past questions                        |
| `*`           | NotFound    | 404                                          |

---

## Design system

All colours live as **semantic tokens** in `tailwind.config.js` and are never
hard-coded in components:

| Token                          | Hex       | Use                     |
| ------------------------------ | --------- | ----------------------- |
| `background`                   | `#0B0D12` | Page background         |
| `surface`                      | `#12151C` | Cards                   |
| `elevated`                     | `#181C26` | Raised elements         |
| `border`                       | `#1F2430` | 1px borders             |
| `text`                         | `#E6E8EE` | Primary text            |
| `muted`                        | `#8A91A3` | Secondary text          |
| `accent.from` → `accent.to`    | `#7C5CFF` → `#22D3EE` | Primary gradient |
| `success` / `warning` / `danger` | `#34D399` / `#FBBF24` / `#F87171` | States |

Fonts: **Space Grotesk** (headings), **Inter** (body), **JetBrains Mono**
(codes and key terms). Cards use a 16px radius and a soft glow on hover; the
navbar and modals use a glass (backdrop-blur) effect. All animations respect
`prefers-reduced-motion`.

---

## How to swap the mock API for the real backend

**Everything server-related is in `src/api/client.js`.** No component calls
`fetch` directly — they all import these functions. To go live, replace each
function body with a real network call and keep the **return shape identical**.

Each mock is marked with:

```js
// MOCK - replace with fetch to backend
```

### The API contract

```js
// solveQuestion({ scheme, branch, semester, subjectCode, question })
// resolves to:
{
  id: 'q_...',
  subject: { code: 'XXX501', name: 'Database Management Systems' },
  module: 3,
  marks: '10M',                       // '5M' | '10M'
  answerPoints: ['...', '...'],        // numbered points, rendered in order
  keyTerms: ['...'],                   // shown as mono chips
  diagramHint: 'string or null',
  sources: [{ title: '...', module: 3 }],
  cached: false
}

// runOcr(file) -> { text: '...', confidence: 0.82 }   // confidence 0..1

// getPyqs({ scheme, branch, semester, subject, year, module, marks })
//   -> PyqItem[]   (all filters optional)

// saveNote(note)   -> { ok: true, id }
// getNotes()       -> Note[]
// getHistory()     -> HistoryItem[]
// sendFeedback({ answerId, rating, comment }) -> { ok: true }   // rating: 'perfect'|'partly'|'wrong'
// login({ method, value }) -> { ok: true, method, value }       // method: 'email'|'usn'
```

### Example: swapping `solveQuestion`

```js
// Before (mock)
export async function solveQuestion(payload) {
  // MOCK - replace with fetch to backend
  await delay(900);
  /* ...pick a canned answer... */
}

// After (real backend)
export async function solveQuestion(payload) {
  const res = await fetch(`${API_BASE}/solve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Solve failed');
  return res.json(); // must match the contract shape above
}
```

### Notes on local data

In this mock phase, **notes, history and the daily usage counter live in the
browser** (`localStorage`, keys prefixed `vtusolve.`). The daily counter resets
at midnight (date-stamped); notes and history persist until cleared. When you
add a real backend you can either keep these local or move `getNotes` /
`getHistory` / `saveNote` to the server — the components read from
`ProfileContext`, so only the context and `client.js` would change.

### Academic data

`src/data/academics.js` returns realistic subject names for **CSE semesters
3–6**; every other combination returns a generic list. **All subject codes are
placeholders** (e.g. `XXX601`) and should be replaced with real syllabus data.

---

## Accessibility

- Keyboard accessible throughout with visible focus rings.
- Icon-only buttons have `aria-label`s; decorative icons are `aria-hidden`.
- Streaming answer text renders in full immediately for screen readers; the
  typewriter effect is a visual layer only, and milestones ("Solving…",
  "Answer ready") are announced via a polite live region.
- Tabs, accordions and popovers expose the right ARIA roles/states.
- All animation respects `prefers-reduced-motion`.

---

*Built for exam preparation — not for use during exams.*
