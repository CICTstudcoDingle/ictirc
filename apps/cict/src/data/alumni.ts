/**
 * Alumni Data
 * CICT Department — ISUFST Dingle Campus
 *
 * TODO: Replace with actual alumni data when provided.
 */

export interface AlumniBatch {
  year: number;
  graduates: number;
  program: string;
}

export interface AlumniTestimonial {
  name: string;
  batch: number;
  program: string;
  role: string;
  company: string;
  quote: string;
  image?: string;
}

// Placeholder alumni batches — approximate data
export const alumniBatches: AlumniBatch[] = [
  { year: 2020, graduates: 45, program: "BSIT" },
  { year: 2020, graduates: 20, program: "BSCS" },
  { year: 2020, graduates: 15, program: "ACT" },
  { year: 2021, graduates: 52, program: "BSIT" },
  { year: 2021, graduates: 22, program: "BSCS" },
  { year: 2021, graduates: 18, program: "ACT" },
  { year: 2022, graduates: 58, program: "BSIT" },
  { year: 2022, graduates: 25, program: "BSCS" },
  { year: 2022, graduates: 20, program: "ACT" },
  { year: 2023, graduates: 65, program: "BSIT" },
  { year: 2023, graduates: 28, program: "BSCS" },
  { year: 2023, graduates: 22, program: "ACT" },
  { year: 2024, graduates: 70, program: "BSIT" },
  { year: 2024, graduates: 30, program: "BSCS" },
  { year: 2024, graduates: 25, program: "ACT" },
  { year: 2025, graduates: 58, program: "BSIT" },
  { year: 2025, graduates: 25, program: "BSCS" },
  { year: 2025, graduates: 20, program: "ACT" },
];

export const alumniTestimonials: AlumniTestimonial[] = [
  {
    name: "Juan Dela Cruz",
    batch: 2022,
    program: "BSIT",
    role: "Full-Stack Developer",
    company: "Tech Company",
    quote:
      "The CICT department provided me with a strong foundation in software development. The hands-on approach and industry exposure prepared me well for my career.",
  },
  {
    name: "Maria Santos",
    batch: 2023,
    program: "BSCS",
    role: "Data Analyst",
    company: "Data Firm",
    quote:
      "The rigorous curriculum in algorithms and data structures at CICT gave me the edge I needed to excel in data science.",
  },
  {
    name: "Pedro Reyes",
    batch: 2021,
    program: "BSIT",
    role: "Network Engineer",
    company: "Telecom Company",
    quote:
      "ISUFST CICT prepared me not just with technical skills, but also with the professionalism and work ethic demanded by the industry.",
  },
];

export const totalAlumni = alumniBatches.reduce((sum, b) => sum + b.graduates, 0);

export const alumniByYear = alumniBatches.reduce<Record<number, number>>((acc, batch) => {
  acc[batch.year] = (acc[batch.year] || 0) + batch.graduates;
  return acc;
}, {});
