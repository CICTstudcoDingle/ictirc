/**
 * Academic Programs Data
 * CICT Department — ISUFST Dingle Campus
 */

export interface Program {
  code: string;
  name: string;
  fullName: string;
  duration: string;
  description: string;
  highlights: string[];
  careers: string[];
}

export const programsData: Program[] = [
  {
    code: "BSIT",
    name: "Information Technology",
    fullName: "Bachelor of Science in Information Technology",
    duration: "4 Years",
    description:
      "The BSIT program prepares students for careers in the IT industry by equipping them with knowledge and skills in software development, networking, database management, web technologies, and IT project management. The curriculum includes hands-on laboratory sessions and capstone projects that simulate real-world IT environments.",
    highlights: [
      "Software Development & Engineering",
      "Network Administration & Security",
      "Database Design & Management",
      "Web & Mobile Application Development",
      "IT Project Management",
      "Industry Internship & On-the-Job Training",
    ],
    careers: [
      "Software Developer",
      "Web Developer",
      "Network Administrator",
      "Database Administrator",
      "IT Project Manager",
      "Systems Analyst",
      "Technical Support Specialist",
    ],
  },
  {
    code: "BSCS",
    name: "Computer Science",
    fullName: "Bachelor of Science in Computer Science",
    duration: "4 Years",
    description:
      "The BSCS program provides a strong theoretical foundation in computing principles, algorithms, data structures, and computational thinking. Students develop expertise in artificial intelligence, machine learning, systems programming, and software engineering, preparing them for research and development roles in the tech industry.",
    highlights: [
      "Algorithm Design & Analysis",
      "Artificial Intelligence & Machine Learning",
      "Data Structures & Computation Theory",
      "Operating Systems & Systems Programming",
      "Software Engineering Practices",
      "Research & Thesis Development",
    ],
    careers: [
      "Software Engineer",
      "Data Scientist",
      "AI/ML Engineer",
      "Research Scientist",
      "Systems Architect",
      "Game Developer",
      "Cybersecurity Analyst",
    ],
  },
  {
    code: "ACT",
    name: "Computer Technology",
    fullName: "Associate in Computer Technology",
    duration: "2 Years",
    description:
      "The ACT program is a two-year associate degree that equips students with foundational knowledge in computer operations, basic programming, hardware troubleshooting, and technical support. It is designed for students who want to quickly enter the workforce or pursue further studies in IT or Computer Science.",
    highlights: [
      "Computer Hardware & Troubleshooting",
      "Basic Programming (Python, Java)",
      "Office Productivity Applications",
      "Computer Networking Fundamentals",
      "Technical Support & Help Desk",
      "Practical Industry Exposure",
    ],
    careers: [
      "Computer Technician",
      "Help Desk Support",
      "Junior Programmer",
      "IT Support Specialist",
      "Office Technology Assistant",
    ],
  },
];

export const totalPrograms = programsData.length;
