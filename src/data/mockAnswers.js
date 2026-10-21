// MOCK - replace with fetch to backend
// Canned answers for the mock solver. The client picks one by simple
// case-insensitive keyword match on the question, falling back to a generic
// answer. Shapes match the solveQuestion API contract exactly.

export const CANNED_ANSWERS = [
  {
    keywords: ['normalization', 'normal form', '1nf', '2nf', '3nf', 'bcnf'],
    subjectHint: 'Database Management Systems',
    module: 3,
    marks: '10M',
    answerPoints: [
      'Normalization is the process of organizing relations to reduce redundancy and avoid insertion, update and deletion anomalies.',
      'First Normal Form (1NF): every attribute holds only atomic (indivisible) values and each record is unique.',
      'Second Normal Form (2NF): the relation is in 1NF and every non-prime attribute is fully functionally dependent on the whole candidate key (no partial dependency).',
      'Third Normal Form (3NF): the relation is in 2NF and no non-prime attribute is transitively dependent on the primary key.',
      'Boyce-Codd Normal Form (BCNF): a stricter 3NF where, for every functional dependency X to Y, X must be a superkey.',
      'Benefits: minimizes duplicate data, keeps the database consistent, and makes updates cheaper; trade-off is more joins at query time.',
    ],
    keyTerms: ['Functional Dependency', 'Candidate Key', 'Transitive Dependency', 'BCNF'],
    diagramHint: 'Draw a dependency diagram showing a table decomposed from 1NF to 3NF.',
    sources: [
      { title: 'Relational Database Design', module: 3 },
      { title: 'Functional Dependencies and Normalization', module: 3 },
    ],
  },
  {
    keywords: ['deadlock', 'coffman', 'circular wait'],
    subjectHint: 'Operating Systems',
    module: 2,
    marks: '10M',
    answerPoints: [
      'A deadlock is a state where a set of processes are each blocked, waiting for a resource held by another process in the same set, so none can proceed.',
      'Four Coffman conditions must hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
      'Deadlock prevention removes one of the four conditions (e.g. request all resources at once to break Hold and Wait).',
      'Deadlock avoidance uses advance knowledge of resource needs; the Bankers algorithm grants a request only if the resulting state is safe.',
      'Deadlock detection lets deadlocks occur, then uses a resource-allocation / wait-for graph to find cycles and recovers by aborting or preempting processes.',
    ],
    keyTerms: ['Mutual Exclusion', 'Circular Wait', "Banker's Algorithm", 'Wait-for Graph'],
    diagramHint: 'Draw a resource-allocation graph with a cycle to illustrate circular wait.',
    sources: [
      { title: 'Process Synchronization and Deadlocks', module: 2 },
      { title: 'Deadlock Handling Strategies', module: 2 },
    ],
  },
  {
    keywords: ['tcp', 'three-way', 'handshake', 'three way'],
    subjectHint: 'Computer Networks',
    module: 4,
    marks: '5M',
    answerPoints: [
      'The TCP three-way handshake establishes a reliable connection before data transfer begins.',
      'Step 1 — SYN: the client sends a segment with the SYN flag set and an initial sequence number (seq = x).',
      'Step 2 — SYN-ACK: the server replies with SYN and ACK set, its own sequence number (seq = y) and acknowledgement (ack = x + 1).',
      'Step 3 — ACK: the client sends an ACK (ack = y + 1); the connection is now established and full-duplex data can flow.',
    ],
    keyTerms: ['SYN', 'ACK', 'Sequence Number', 'Full-Duplex'],
    diagramHint: 'Draw a client-server timeline with SYN, SYN-ACK and ACK arrows.',
    sources: [{ title: 'Transport Layer — TCP', module: 4 }],
  },
  {
    keywords: ['stack', 'push', 'pop', 'lifo'],
    subjectHint: 'Data Structures and Applications',
    module: 2,
    marks: '5M',
    answerPoints: [
      'A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle.',
      'push(x): insert element x at the top; pop(): remove and return the top element; both run in O(1) time.',
      'A fixed-size stack reports overflow when full and underflow when a pop is attempted on an empty stack.',
      'Common uses: function call management, expression evaluation and conversion, and undo operations.',
    ],
    keyTerms: ['LIFO', 'Overflow', 'Underflow', 'Top Pointer'],
    diagramHint: 'Show a vertical stack with the top pointer after two pushes and one pop.',
    sources: [{ title: 'Linear Data Structures — Stacks', module: 2 }],
  },
  {
    keywords: ['oop', 'object oriented', 'encapsulation', 'inheritance', 'polymorphism'],
    subjectHint: 'Object Oriented Programming with Java',
    module: 1,
    marks: '10M',
    answerPoints: [
      'Object-oriented programming models software as a collection of objects that bundle data and behaviour.',
      'Encapsulation: wrap data and the methods that operate on it inside a class and hide internal state behind access modifiers.',
      'Abstraction: expose only the essential features of an object while hiding implementation detail behind interfaces or abstract classes.',
      'Inheritance: a subclass reuses and extends the fields and methods of a superclass, promoting code reuse.',
      'Polymorphism: a single interface serves different underlying types — compile-time via overloading and run-time via overriding.',
    ],
    keyTerms: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism'],
    diagramHint: 'Draw a class hierarchy with a superclass and two subclasses overriding a method.',
    sources: [
      { title: 'Introduction to OOP', module: 1 },
      { title: 'Classes and Objects in Java', module: 1 },
    ],
  },
  {
    keywords: ['dijkstra', 'shortest path', 'greedy'],
    subjectHint: 'Design and Analysis of Algorithms',
    module: 4,
    marks: '10M',
    answerPoints: [
      "Dijkstra's algorithm finds the shortest paths from a single source to all vertices in a graph with non-negative edge weights.",
      'Maintain a distance array initialised to infinity, with the source set to 0, and a set of finalised vertices.',
      'Repeatedly pick the unfinalised vertex with the smallest tentative distance, finalise it, and relax all its outgoing edges.',
      'Relaxation updates dist[v] = min(dist[v], dist[u] + weight(u, v)) for each neighbour v of the chosen vertex u.',
      'Using a binary min-heap the time complexity is O((V + E) log V); it is a greedy algorithm and fails with negative edge weights.',
    ],
    keyTerms: ['Greedy', 'Relaxation', 'Min-Heap', 'Priority Queue'],
    diagramHint: 'Draw a weighted graph and show the distance table after each iteration.',
    sources: [
      { title: 'Greedy Algorithms', module: 4 },
      { title: 'Single Source Shortest Paths', module: 4 },
    ],
  },
];

// Generic fallback used when no keyword matches.
export const GENERIC_ANSWER = {
  subjectHint: null,
  module: 1,
  marks: '5M',
  answerPoints: [
    'Begin with a clear definition of the key term asked in the question to set the context.',
    'State the main principle or working of the concept in two or three concise points.',
    'Give a short example or application so the examiner sees you can apply the idea.',
    'Close with one line on the advantage, limitation or significance of the concept.',
  ],
  keyTerms: ['Definition', 'Principle', 'Example', 'Significance'],
  diagramHint: null,
  sources: [{ title: 'Subject Fundamentals', module: 1 }],
};

// Deterministic OCR fixtures. Each uploaded image maps to a fixed result so a
// given demo image always produces the same text + confidence. The client
// cycles through these in order of upload for predictable demos.
export const OCR_FIXTURES = [
  {
    text: 'Explain the three normal forms (1NF, 2NF, 3NF) with examples.',
    confidence: 0.92,
  },
  {
    text: 'What is a deadlock? List the four Coffman conditions.',
    confidence: 0.84,
  },
  {
    // Low-confidence fixture to exercise the "please check the text" warning.
    text: 'Expl4in the TCP three-way handshakc with a neat diagram.',
    confidence: 0.63,
  },
];
