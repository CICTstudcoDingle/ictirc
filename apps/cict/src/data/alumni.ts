/**
 * Alumni Data
 * CICT Department — ISUFST Dingle Campus
 * Program: BSIT only
 *
 * TODO: Replace with actual verified alumni data when provided.
 */

export interface AlumniBatch {
  year: number;
  graduates: number;
}

export interface AlumniTestimonial {
  name: string;
  batch: number;
  program: string;
  role: string;
  company: string;
  quote: string;
}

export const alumniBatches: AlumniBatch[] = [
  { year: 2020, graduates: 52 },
  { year: 2021, graduates: 58 },
  { year: 2022, graduates: 65 },
  { year: 2023, graduates: 72 },
  { year: 2024, graduates: 80 },
  { year: 2025, graduates: 91 },
];

export const alumniTestimonials: AlumniTestimonial[] = [
  {
    name: "BSIT Graduate",
    batch: 2022,
    program: "BSIT",
    role: "Full-Stack Developer",
    company: "Tech Company",
    quote:
      "The CICT department provided me with a strong foundation in software development. The hands-on approach and industry exposure prepared me well for my career.",
  },
  {
    name: "BSIT Graduate",
    batch: 2023,
    program: "BSIT",
    role: "Systems Analyst",
    company: "Government Agency",
    quote:
      "ISUFST CICT prepared me not just technically but professionally. The faculty truly cares about their students' success.",
  },
  {
    name: "BSIT Graduate",
    batch: 2021,
    program: "BSIT",
    role: "Network Engineer",
    company: "Telecom Company",
    quote:
      "The rigorous curriculum and dedicated mentors at CICT gave me the edge I needed to succeed in the competitive IT industry.",
  },
];

export const totalAlumni = alumniBatches.reduce((sum, b) => sum + b.graduates, 0);

export const alumniByYear: Record<number, number> = alumniBatches.reduce<Record<number, number>>(
  (acc, batch) => {
    acc[batch.year] = batch.graduates;
    return acc;
  },
  {}
);
