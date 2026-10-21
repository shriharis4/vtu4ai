// MOCK - replace with fetch to backend
//
// This is the ONLY file that talks to "the server". Every function here returns
// a Promise shaped exactly like the future backend response, after a realistic
// delay. To go live, replace each body with a real `fetch` call to your API and
// keep the same return shape — no component will need to change.
//
// See README section "How to swap the mock API for the real backend".

import { getSubjects } from '../data/academics';
import { CANNED_ANSWERS, GENERIC_ANSWER, OCR_FIXTURES } from '../data/mockAnswers';
import { MOCK_PYQS } from '../data/mockPyqs';

// --- helpers ---------------------------------------------------------------

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const uid = () => `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Pick a canned answer by case-insensitive keyword match; fall back to generic.
function matchAnswer(question = '') {
  const q = question.toLowerCase();
  return (
    CANNED_ANSWERS.find((a) => a.keywords.some((k) => q.includes(k))) || GENERIC_ANSWER
  );
}

// Resolve the subject { code, name } for the answer header.
function resolveSubject({ scheme, branch, semester, subjectCode }, answer) {
  const subjects = getSubjects(scheme, branch, semester);
  const match = subjects.find((s) => s.code === subjectCode);
  if (match) return { code: match.code, name: match.name };
  // Fallback to the canned answer's subject hint if the code is unknown.
  return { code: subjectCode || 'XXX000', name: answer.subjectHint || 'General' };
}

// Track which OCR fixture to serve next so uploads are deterministic per session.
let ocrIndex = 0;

// --- API ------------------------------------------------------------------

/**
 * solveQuestion({ scheme, branch, semester, subjectCode, question })
 * -> { id, subject, module, marks, answerPoints, keyTerms, diagramHint, sources, cached }
 */
export async function solveQuestion({
  scheme,
  branch,
  semester,
  subjectCode,
  question,
}) {
  // MOCK - replace with fetch to backend
  await delay(900);
  const answer = matchAnswer(question);
  const subject = resolveSubject({ scheme, branch, semester, subjectCode }, answer);
  return {
    id: uid(),
    subject,
    module: answer.module,
    marks: answer.marks,
    answerPoints: answer.answerPoints,
    keyTerms: answer.keyTerms,
    diagramHint: answer.diagramHint,
    sources: answer.sources,
    cached: false,
  };
}

/**
 * runOcr(file) -> { text, confidence }
 * Deterministic: cycles through fixed fixtures regardless of the file content.
 */
export async function runOcr(_file) {
  // MOCK - replace with fetch to backend
  await delay(1500);
  const fixture = OCR_FIXTURES[ocrIndex % OCR_FIXTURES.length];
  ocrIndex += 1;
  return { text: fixture.text, confidence: fixture.confidence };
}

/**
 * getPyqs(filters) -> PyqItem[]
 * filters: { scheme, branch, semester, subject, year, module, marks }
 * All filters are optional; omitted/empty values are ignored.
 */
export async function getPyqs(filters = {}) {
  // MOCK - replace with fetch to backend
  await delay(600);
  const { subject, year, module, marks } = filters;
  return MOCK_PYQS.filter((p) => {
    if (subject && p.subjectCode !== subject) return false;
    if (year && String(p.year) !== String(year)) return false;
    if (module && String(p.module) !== String(module)) return false;
    if (marks && p.marks !== marks) return false;
    return true;
  });
}

/**
 * saveNote(note) -> { ok: true, id }
 * Persistence lives in ProfileContext/localStorage; this just simulates the
 * server acknowledging the save.
 */
export async function saveNote(note) {
  // MOCK - replace with fetch to backend
  await delay(300);
  return { ok: true, id: note?.id || uid() };
}

/**
 * getNotes() -> Note[]
 * In this mock, notes are owned by the client (localStorage), so the server
 * stub returns an empty list; the UI reads from context.
 */
export async function getNotes() {
  // MOCK - replace with fetch to backend
  await delay(300);
  return [];
}

/**
 * getHistory() -> HistoryItem[]
 * Same as notes: owned locally in this mock phase.
 */
export async function getHistory() {
  // MOCK - replace with fetch to backend
  await delay(300);
  return [];
}

/**
 * sendFeedback({ answerId, rating, comment }) -> { ok: true }
 * rating: 'perfect' | 'partly' | 'wrong'
 */
export async function sendFeedback(_payload) {
  // MOCK - replace with fetch to backend
  await delay(300);
  return { ok: true };
}

/**
 * login({ method, value }) -> { ok: true, method, value }
 * method: 'email' | 'usn'. Always "succeeds" in the mock.
 */
export async function login({ method, value }) {
  // MOCK - replace with fetch to backend
  await delay(1000);
  return { ok: true, method, value };
}
