/**
 * Faculty & Staff Data
 * CICT Department — ISUFST Dingle Campus
 */

export interface FacultyMember {
  name: string;
  title: string;
  position: string;
  specialization?: string;
  email?: string;
  type: "dean" | "faculty" | "staff";
}

export const facultyData: FacultyMember[] = [
  // Dean
  {
    name: "Dr. Renante A. Diamante",
    title: "Doctor of Education",
    position: "Dean, College of Information and Communication Technology",
    email: "cict_dingle@isufst.edu.ph",
    type: "dean",
  },
  // Faculty
  {
    name: "Dr. Glenn C. Tabia",
    title: "Doctorate Degree",
    position: "Faculty Member",
    type: "faculty",
  },
  {
    name: "Dr. Benjamin L. Cornelio Jr.",
    title: "Doctorate Degree",
    position: "Faculty Member",
    type: "faculty",
  },
  {
    name: "Renly Jade S. Laud, MIT",
    title: "Master of Information Technology",
    position: "Faculty Member",
    type: "faculty",
  },
  {
    name: "Rebie L. Danitaras, MIT",
    title: "Master of Information Technology",
    position: "Faculty Member",
    type: "faculty",
  },
  {
    name: "Teddy S. Fuentivilla, MIT",
    title: "Master of Information Technology",
    position: "Faculty Member",
    type: "faculty",
  },
  {
    name: "Ricky Cyril Perucho, MIT",
    title: "Master of Information Technology",
    position: "Faculty Member",
    type: "faculty",
  },
  {
    name: "Rowena S. Borcelo, MPA",
    title: "Master of Public Administration",
    position: "Faculty Member",
    type: "faculty",
  },
  // Staff
  {
    name: "Jezza Mae V. Catiquesta",
    title: "Administrative Staff",
    position: "Department Staff",
    type: "staff",
  },
  {
    name: "Ric John Puying",
    title: "Administrative Staff",
    position: "Department Staff",
    type: "staff",
  },
];

export const dean = facultyData.find((f) => f.type === "dean");
export const faculty = facultyData.filter((f) => f.type === "faculty");
export const staff = facultyData.filter((f) => f.type === "staff");
export const totalFaculty = faculty.length;
export const totalStaff = staff.length;
