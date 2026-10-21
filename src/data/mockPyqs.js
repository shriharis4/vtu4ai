// MOCK - replace with fetch to backend
// Static previous-year questions. "askedCount" is hardcoded per item (how many
// times the question has appeared across exams). Answers reuse the same point
// style as the solver. Query params from the solver pre-filter this list.

export const MOCK_PYQS = [
  {
    id: 'pyq-1',
    subjectCode: 'XXX501',
    subjectName: 'Database Management Systems',
    question: 'Explain the three normal forms (1NF, 2NF, 3NF) with suitable examples.',
    year: 2023,
    module: 3,
    marks: '10M',
    askedCount: 7,
    answerPoints: [
      '1NF removes repeating groups so every attribute is atomic.',
      '2NF removes partial dependencies on a composite key.',
      '3NF removes transitive dependencies on the primary key.',
    ],
  },
  {
    id: 'pyq-2',
    subjectCode: 'XXX501',
    subjectName: 'Database Management Systems',
    question: 'Differentiate between DELETE, DROP and TRUNCATE commands in SQL.',
    year: 2022,
    module: 2,
    marks: '5M',
    askedCount: 5,
    answerPoints: [
      'DELETE removes selected rows and can be rolled back; it is a DML command.',
      'TRUNCATE removes all rows quickly, cannot be rolled back easily, and resets identity.',
      'DROP removes the entire table structure along with its data.',
    ],
  },
  {
    id: 'pyq-3',
    subjectCode: 'XXX502',
    subjectName: 'Computer Networks',
    question: 'Describe the TCP three-way handshake with a neat diagram.',
    year: 2023,
    module: 4,
    marks: '5M',
    askedCount: 9,
    answerPoints: [
      'Client sends SYN with an initial sequence number.',
      'Server replies with SYN-ACK acknowledging the client.',
      'Client sends a final ACK and the connection is established.',
    ],
  },
  {
    id: 'pyq-4',
    subjectCode: 'XXX502',
    subjectName: 'Computer Networks',
    question: 'Compare the OSI reference model with the TCP/IP model.',
    year: 2021,
    module: 1,
    marks: '10M',
    askedCount: 6,
    answerPoints: [
      'OSI has 7 layers; TCP/IP has 4 (or 5) layers.',
      'OSI is a reference model; TCP/IP is implementation-driven.',
      'TCP/IP combines OSI session, presentation and application into one.',
    ],
  },
  {
    id: 'pyq-5',
    subjectCode: 'XXX301',
    subjectName: 'Data Structures and Applications',
    question: 'Explain stack operations (push, pop) and list two applications.',
    year: 2022,
    module: 2,
    marks: '5M',
    askedCount: 8,
    answerPoints: [
      'push inserts at the top, pop removes from the top — both O(1).',
      'Overflow and underflow guard the fixed-size bounds.',
      'Applications: expression evaluation and function call stacks.',
    ],
  },
  {
    id: 'pyq-6',
    subjectCode: 'XXX401',
    subjectName: 'Design and Analysis of Algorithms',
    question: "Write and analyse Dijkstra's shortest path algorithm.",
    year: 2023,
    module: 4,
    marks: '10M',
    askedCount: 4,
    answerPoints: [
      'Greedily finalise the nearest unvisited vertex each step.',
      'Relax outgoing edges to update tentative distances.',
      'Runs in O((V + E) log V) with a min-heap.',
    ],
  },
  {
    id: 'pyq-7',
    subjectCode: 'XXX305',
    subjectName: 'Object Oriented Programming with Java',
    question: 'Explain the four pillars of object-oriented programming.',
    year: 2021,
    module: 1,
    marks: '10M',
    askedCount: 10,
    answerPoints: [
      'Encapsulation bundles data with methods and hides state.',
      'Inheritance enables reuse through superclass/subclass.',
      'Polymorphism and abstraction complete the four pillars.',
    ],
  },
  {
    id: 'pyq-8',
    subjectCode: 'XXX601',
    subjectName: 'Operating Systems Concepts',
    question: 'What is a deadlock? Explain the four necessary conditions.',
    year: 2022,
    module: 2,
    marks: '10M',
    askedCount: 6,
    answerPoints: [
      'Deadlock: processes wait on each other in a cycle.',
      'Four Coffman conditions must hold simultaneously.',
      'Prevention breaks one of the four conditions.',
    ],
  },
];

// Distinct values for the PYQ filter dropdowns.
export const PYQ_YEARS = [2023, 2022, 2021];
export const PYQ_MODULES = [1, 2, 3, 4, 5];
export const PYQ_MARKS = ['5M', '10M'];
