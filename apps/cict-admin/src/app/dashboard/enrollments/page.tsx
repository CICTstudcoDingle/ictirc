import { requireCictAccess } from "@/lib/auth";
import { prisma } from "@ictirc/database";
import {
  createDepartmentWithFeeAction,
  createEnrollmentAction,
  updateEnrollmentStatusAction,
} from "../actions";

type DepartmentRecord = {
  id: string;
  name: string;
};

type EnrollmentRecord = {
  id: string;
  studentName: string;
  studentNumber: string;
  program: string;
  yearLevel: number;
  departmentFee: number | string;
  sectionName: string | null;
  status: string;
  department: DepartmentRecord;
};

export default async function EnrollmentsPage() {
  await requireCictAccess();

  const [departments, enrollments] = (await Promise.all([
    prisma.cictDepartment.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.cictEnrollment.findMany({
      include: { department: true },
      orderBy: { submittedAt: "desc" },
      take: 50,
    }),
  ])) as unknown as [DepartmentRecord[], EnrollmentRecord[]];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-maroon">Enrollment Queue</h1>
        <p className="mt-1 text-sm text-gray-600">Incoming students pay a fixed PHP 50 department fee before enrollment. Section can stay blank.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <form action={createDepartmentWithFeeAction} className="panel p-5 space-y-3">
          <h2 className="text-lg font-semibold">Department and Fee Setup</h2>
          <p className="text-xs text-gray-500">Fee is fixed at PHP 50 for all departments and terms.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="code" placeholder="Department code (e.g. BSIT)" className="input" required />
            <input name="name" placeholder="Department name" className="input" required />
            <input name="academicYear" placeholder="Academic year (e.g. 2026-2027)" className="input" required />
          </div>
          <button className="btn-primary" type="submit">Save Department Fee</button>
        </form>

        <form action={createEnrollmentAction} className="panel p-5 space-y-3">
          <h2 className="text-lg font-semibold">New Enrollment</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="studentName" placeholder="Student full name" className="input" required />
            <input name="studentNumber" placeholder="Student number" className="input" required />
            <input name="program" placeholder="Program" className="input" required />
            <input name="yearLevel" type="number" min="1" max="6" placeholder="Year level" className="input" required />
            <input name="academicYear" placeholder="Academic year" className="input" required />
            <select name="departmentId" className="input" aria-label="Select department" required>
              <option value="">Select department</option>
              {departments.map((department: DepartmentRecord) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <textarea name="remarks" className="input" placeholder="Remarks (optional)" rows={3} />
          <button className="btn-primary" type="submit">Create Enrollment</button>
        </form>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-100 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment: EnrollmentRecord) => (
                <tr key={enrollment.id} className="border-t border-gray-200">
                  <td className="px-4 py-3">
                    <p className="font-medium">{enrollment.studentName}</p>
                    <p className="text-xs text-gray-500">{enrollment.studentNumber}</p>
                  </td>
                  <td className="px-4 py-3">{enrollment.program} (Year {enrollment.yearLevel})</td>
                  <td className="px-4 py-3">{enrollment.department.name}</td>
                  <td className="px-4 py-3">PHP {Number(enrollment.departmentFee).toFixed(2)}</td>
                  <td className="px-4 py-3">{enrollment.sectionName || "(blank)"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-maroon/10 px-2.5 py-1 text-xs font-semibold text-maroon">
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateEnrollmentStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="enrollmentId" value={enrollment.id} />
                      <select name="status" className="input max-w-[180px]" aria-label="Update enrollment status" defaultValue={enrollment.status}>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="ENROLLED">ENROLLED</option>
                      </select>
                      <input name="sectionName" className="input max-w-[180px]" placeholder="Section (optional)" />
                      <button className="btn-primary" type="submit">Update</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
