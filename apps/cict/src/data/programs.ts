/**
 * Academic Programs Data
 * CICT Department — ISUFST Dingle Campus
 *
 * Note: CICT currently offers ONE program: BSIT with 3 specializations
 */

export interface Specialization {
  name: string;
  description: string;
}

export interface Program {
  code: string;
  name: string;
  fullName: string;
  duration: string;
  description: string;
  highlights: string[];
  careers: string[];
  specializations: Specialization[];
}

export const programsData: Program[] = [
  {
    code: "BSIT",
    name: "Information Technology",
    fullName: "Bachelor of Science in Information Technology",
    duration: "4 Years",
    description:
      "The Bachelor of Science in Information Technology (BSIT) program at ISUFST CICT is a four-year degree that prepares students for careers in the IT industry. Students gain comprehensive knowledge and hands-on skills in software development, web technologies, networking, database management, and IT project management. The curriculum blends theoretical instruction with intensive laboratory experience, culminating in a specialization in cutting-edge technology fields.",
    highlights: [
      "Software Development & Engineering",
      "Web & Mobile Application Development",
      "Network Administration & Security",
      "Database Design & Management",
      "IT Project Management (PMBOK, Agile)",
      "Systems Analysis & Design",
      "Industry Internship / OJT",
      "Capstone Research Project",
    ],
    careers: [
      "Software Developer",
      "Web Developer",
      "Mobile App Developer",
      "Network Administrator",
      "Database Administrator",
      "IT Project Manager",
      "Systems Analyst",
      "Technical Support Specialist",
      "UI/UX Designer",
      "IT Entrepreneur",
    ],
    specializations: [
      {
        name: "AI and Robotics",
        description: "Focuses on artificial intelligence, machine learning, and automated systems development.",
      },
      {
        name: "Web and Mobile",
        description: "Concentrates on advanced web development and mobile application ecosystems.",
      },
      {
        name: "Networking",
        description: "Specializes in network infrastructure, security, and cloud computing.",
      },
    ],
  },
];

export const totalPrograms = programsData.length; // 1
