// Academic reference data for VTU Solve.
// NOTE: All subject codes here are PLACEHOLDERS (e.g. 'XXX601'). The real
// scheme-accurate subject list and codes will come from syllabus data later.

export const SCHEMES = [
  { id: '2015', label: '2015', years: '2015–2017 batches' },
  { id: '2017', label: '2017', years: '2017–2018 batches' },
  { id: '2018', label: '2018', years: '2018–2021 batches' },
  { id: '2021', label: '2021', years: '2021–2022 batches' },
  { id: '2022', label: '2022', years: '2022–2025 batches' },
  { id: '2025', label: '2025', years: '2025 batch onward' },
];

export const BRANCHES = [
  { id: 'CSE', name: 'Computer Science & Engineering' },
  { id: 'ISE', name: 'Information Science & Engineering' },
  { id: 'AIML', name: 'Artificial Intelligence & Machine Learning' },
  { id: 'AIDS', name: 'Artificial Intelligence & Data Science' },
  { id: 'ECE', name: 'Electronics & Communication Engineering' },
  { id: 'EEE', name: 'Electrical & Electronics Engineering' },
  { id: 'ME', name: 'Mechanical Engineering' },
  { id: 'CV', name: 'Civil Engineering' },
  { id: 'Aerospace', name: 'Aerospace Engineering' },
  { id: 'Automobile', name: 'Automobile Engineering' },
  { id: 'Biotechnology', name: 'Biotechnology' },
  { id: 'Chemical', name: 'Chemical Engineering' },
  { id: 'Biomedical', name: 'Biomedical Engineering' },
  { id: 'Telecommunication', name: 'Telecommunication Engineering' },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Realistic CSE subject names for semesters 3–6. Codes remain placeholders.
const CSE_SUBJECTS = {
  3: [
    { code: 'XXX301', name: 'Data Structures and Applications' },
    { code: 'XXX302', name: 'Analog and Digital Electronics' },
    { code: 'XXX303', name: 'Computer Organization' },
    { code: 'XXX304', name: 'Discrete Mathematical Structures' },
    { code: 'XXX305', name: 'Object Oriented Programming with Java' },
  ],
  4: [
    { code: 'XXX401', name: 'Design and Analysis of Algorithms' },
    { code: 'XXX402', name: 'Microcontrollers and Embedded Systems' },
    { code: 'XXX403', name: 'Operating Systems' },
    { code: 'XXX404', name: 'Theory of Computation' },
    { code: 'XXX405', name: 'Data Communication' },
  ],
  5: [
    { code: 'XXX501', name: 'Database Management Systems' },
    { code: 'XXX502', name: 'Computer Networks' },
    { code: 'XXX503', name: 'Automata Theory and Compiler Design' },
    { code: 'XXX504', name: 'Software Engineering and Project Management' },
    { code: 'XXX505', name: 'Artificial Intelligence' },
  ],
  6: [
    { code: 'XXX601', name: 'Operating Systems Concepts' },
    { code: 'XXX602', name: 'Computer Graphics and Visualization' },
    { code: 'XXX603', name: 'Machine Learning' },
    { code: 'XXX604', name: 'Cloud Computing and Security' },
    { code: 'XXX605', name: 'Full Stack Web Development' },
  ],
};

// Generic fallback subject names used for every non-CSE-3-to-6 combination.
const GENERIC_SUBJECT_NAMES = [
  'Engineering Mathematics',
  'Core Theory Paper I',
  'Core Theory Paper II',
  'Applied Concepts',
  'Design and Analysis',
  'Professional Elective',
];

/**
 * Returns 4–6 subjects for a scheme/branch/semester combination.
 * Each subject: { code, name, modules: 5 }.
 *
 * Realistic names are provided for CSE semesters 3–6; every other
 * combination returns a generic placeholder list. All codes are placeholders.
 */
export function getSubjects(scheme, branch, semester) {
  const sem = Number(semester);

  if (branch === 'CSE' && CSE_SUBJECTS[sem]) {
    return CSE_SUBJECTS[sem].map((s) => ({ ...s, modules: 5 }));
  }

  // Generic list: 5 subjects with placeholder codes derived from branch + sem.
  const prefix = (branch || 'XXX').slice(0, 3).toUpperCase().padEnd(3, 'X');
  return GENERIC_SUBJECT_NAMES.slice(0, 5).map((name, i) => ({
    code: `${prefix}${sem}0${i + 1}`,
    name,
    modules: 5,
  }));
}
