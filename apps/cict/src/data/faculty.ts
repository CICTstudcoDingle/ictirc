/**
 * Faculty & Staff Data
 * CICT Department — ISUFST Dingle Campus
 *
 * TODO: Replace with actual faculty data when provided.
 */

export interface FacultyMember {
  name: string;
  title: string;
  position: string;
  specialization: string;
  email?: string;
  image?: string;
}

export const facultyData: FacultyMember[] = [
  {
    name: "Dr. Faculty Member",
    title: "Ph.D. in Information Technology",
    position: "Dean, College of ICT",
    specialization: "Software Engineering, IT Education",
    email: "cict_dingle@isufst.edu.ph",
  },
  {
    name: "Prof. Faculty Member",
    title: "M.S. in Computer Science",
    position: "Program Chair, BSIT",
    specialization: "Web Technologies, Database Systems",
  },
  {
    name: "Prof. Faculty Member",
    title: "M.S. in Information Technology",
    position: "Program Chair, BSCS",
    specialization: "Algorithms, Machine Learning",
  },
  {
    name: "Instructor Name",
    title: "M.S. in Information Technology",
    position: "Faculty Member",
    specialization: "Networking, Cybersecurity",
  },
  {
    name: "Instructor Name",
    title: "M.S. in Computer Science",
    position: "Faculty Member",
    specialization: "Mobile Development, IoT",
  },
  {
    name: "Instructor Name",
    title: "M.IT",
    position: "Faculty Member",
    specialization: "Systems Administration, Cloud Computing",
  },
];

export const totalFaculty = facultyData.length;
