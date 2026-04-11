/**
 * AY 2025-2026 Student Enrollment Data
 * CICT Department — ISUFST Dingle Campus
 *
 * TODO: Replace placeholder data with actual student list once provided.
 */

export interface Student {
  name: string;
}

export interface StudentSection {
  section: string;
  students: Student[];
  count: number;
}

export interface ProgramEnrollment {
  program: string;
  code: string;
  description: string;
  sections: StudentSection[];
  totalStudents: number;
}

export const academicYear = "2025-2026";

// Placeholder enrollment data — to be populated with real student list
export const enrollmentData: ProgramEnrollment[] = [
  {
    program: "Bachelor of Science in Information Technology",
    code: "BSIT",
    description: "A four-year degree program that equips students with knowledge and skills in software development, networking, database management, and IT project management.",
    sections: [
      {
        section: "BSIT 1A",
        students: Array.from({ length: 40 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 40,
      },
      {
        section: "BSIT 1B",
        students: Array.from({ length: 38 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 38,
      },
      {
        section: "BSIT 2A",
        students: Array.from({ length: 42 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 42,
      },
      {
        section: "BSIT 2B",
        students: Array.from({ length: 36 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 36,
      },
      {
        section: "BSIT 3A",
        students: Array.from({ length: 35 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 35,
      },
      {
        section: "BSIT 3B",
        students: Array.from({ length: 33 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 33,
      },
      {
        section: "BSIT 4A",
        students: Array.from({ length: 30 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 30,
      },
      {
        section: "BSIT 4B",
        students: Array.from({ length: 28 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 28,
      },
    ],
    totalStudents: 282,
  },
  {
    program: "Bachelor of Science in Computer Science",
    code: "BSCS",
    description: "A four-year degree program focused on the theoretical foundations of computing, algorithm design, artificial intelligence, and systems development.",
    sections: [
      {
        section: "BSCS 1A",
        students: Array.from({ length: 35 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 35,
      },
      {
        section: "BSCS 2A",
        students: Array.from({ length: 32 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 32,
      },
      {
        section: "BSCS 3A",
        students: Array.from({ length: 28 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 28,
      },
      {
        section: "BSCS 4A",
        students: Array.from({ length: 25 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 25,
      },
    ],
    totalStudents: 120,
  },
  {
    program: "Associate in Computer Technology",
    code: "ACT",
    description: "A two-year associate degree that provides fundamental knowledge in computer operations, programming, and technical support.",
    sections: [
      {
        section: "ACT 1A",
        students: Array.from({ length: 30 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 30,
      },
      {
        section: "ACT 2A",
        students: Array.from({ length: 25 }, (_, i) => ({ name: `Student ${i + 1}` })),
        count: 25,
      },
    ],
    totalStudents: 55,
  },
];

export const totalEnrolled = enrollmentData.reduce((sum, p) => sum + p.totalStudents, 0);
export const totalPrograms = enrollmentData.length;
export const totalSections = enrollmentData.reduce((sum, p) => sum + p.sections.length, 0);
