import { existsSync, readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { academicYear, enrollmentData } from "../../../apps/cict/src/data/students";

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }

    const equalsIndex = line.indexOf("=");
    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1).trim().replace(/^['\"]|['\"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

for (const candidate of [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), ".env.local"),
  resolve(process.cwd(), "..", ".env"),
  resolve(process.cwd(), "..", ".env.local"),
  resolve(process.cwd(), "..", "..", ".env"),
  resolve(process.cwd(), "..", "..", ".env.local"),
  resolve(process.cwd(), "..", "..", "apps", "cict-admin", ".env"),
  resolve(process.cwd(), "..", "..", "apps", "cict-admin", ".env.local"),
]) {
  loadEnvFile(candidate);
}

const prisma = new PrismaClient();

const demoAccounts = [
  {
    role: "ADMIN" as const,
    email: "cict.admin@ictirc.local",
    password: "CictAdmin123!",
    name: "CICT Admin",
  },
  {
    role: "FACULTY" as const,
    email: "cict.faculty@ictirc.local",
    password: "CictFaculty123!",
    name: "CICT Faculty",
  },
  {
    role: "OFFICER" as const,
    email: "cict.officer@ictirc.local",
    password: "CictOfficer123!",
    name: "CICT Officer",
  },
] as const;

type DemoAccount = (typeof demoAccounts)[number];

function normalizeSection(section: string) {
  return section.replace(/\s+/g, "").toUpperCase();
}

function buildStudentNumber(programCode: string, section: string, sequence: number) {
  return `AY${academicYear.replace(/-/g, "")}-${programCode}-${normalizeSection(section)}-${String(sequence).padStart(3, "0")}`;
}

function buildReferenceNumber(section: string, sequence: number) {
  return `REF-${normalizeSection(section)}-${String(sequence).padStart(3, "0")}`;
}

function buildReceiptNo(sequence: number) {
  return `RCP-SEED-${String(sequence).padStart(4, "0")}`;
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function ensureDemoAuthUser(account: DemoAccount) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.log(`  - Skipping Supabase Auth seeding for ${account.email}; service role env vars are missing.`);
    return `demo-${account.role.toLowerCase()}`;
  }

  const supabase = createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    throw new Error(`Unable to inspect Supabase Auth users for ${account.email}: ${listError.message}`);
  }

  const existingUser = usersData.users.find((user) => user.email?.toLowerCase() === account.email.toLowerCase());
  if (existingUser) {
    return existingUser.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: {
      full_name: account.name,
      role: account.role,
    },
  });

  if (error || !data.user) {
    throw new Error(`Unable to create Supabase Auth user for ${account.email}: ${error?.message || "unknown error"}`);
  }

  return data.user.id;
}

async function seedCategories() {
  const hierarchy = [
    {
      name: "Information and Communications Technology",
      slug: "ict",
      description: "Broad field covering all aspects of managing and processing information.",
      children: [
        { name: "AI and Robotics", slug: "ai-robotics" },
        { name: "Web and Mobile", slug: "web-mobile" },
        { name: "Software Development", slug: "software-dev" },
        { name: "Computer Networking", slug: "networking" },
        { name: "Information Systems", slug: "info-systems" },
        { name: "Other related technological studies", slug: "other-tech" },
      ],
    },
    {
      name: "Computer Science and Engineering",
      slug: "cse",
      description: "Theoretical and practical approach to computation and its applications.",
      children: [
        { name: "Electronics & Communications Engineering", slug: "ece" },
        { name: "Mathematics", slug: "math" },
      ],
    },
    {
      name: "Industrial Technology",
      slug: "ind-tech",
      description: "Field concerned with the application of engineering and manufacturing technology.",
      children: [{ name: "General Industrial Technology", slug: "gen-ind-tech" }],
    },
  ];

  console.log("📂 Upserting category hierarchy...");

  for (const root of hierarchy) {
    const parent = await prisma.category.upsert({
      where: { slug: root.slug },
      update: {
        name: root.name,
        description: root.description,
      },
      create: {
        name: root.name,
        slug: root.slug,
        description: root.description,
      },
    });

    if (root.children?.length) {
      for (const child of root.children) {
        await prisma.category.upsert({
          where: { slug: child.slug },
          update: {
            name: child.name,
            parentId: parent.id,
          },
          create: {
            name: child.name,
            slug: child.slug,
            parentId: parent.id,
          },
        });
      }
    }
  }

  const count = await prisma.category.count();
  console.log(`  - Categories synchronized: ${count}`);
}

async function seedCictData() {
  const program = enrollmentData[0];
  const termLabel = `${academicYear} 2nd Semester`;

  const adminIds: Record<DemoAccount["role"], string> = {
    ADMIN: "",
    FACULTY: "",
    OFFICER: "",
  };

  for (const account of demoAccounts) {
    const authUserId = await ensureDemoAuthUser(account);
    adminIds[account.role] = authUserId;

    await prisma.cictAdminProfile.upsert({
      where: { email: account.email },
      update: {
        name: account.name,
        role: account.role,
        isActive: true,
      },
      create: {
        id: authUserId,
        email: account.email,
        name: account.name,
        role: account.role,
        isActive: true,
      },
    });
  }

  const department = await prisma.cictDepartment.upsert({
    where: { code: program.code },
    update: {
      name: program.program,
      isActive: true,
    },
    create: {
      code: program.code,
      name: program.program,
      isActive: true,
    },
  });

  await prisma.cictDepartmentFee.upsert({
    where: {
      departmentId_academicYear: {
        departmentId: department.id,
        academicYear,
      },
    },
    update: {
      amount: 50,
      isActive: true,
    },
    create: {
      departmentId: department.id,
      academicYear,
      amount: 50,
      isActive: true,
    },
  });

  const seedPrefix = `AY${academicYear.replace(/-/g, "")}-${program.code}-`;
  const existingSeededEnrollment = await prisma.cictEnrollment.findFirst({
    where: {
      studentNumber: {
        startsWith: seedPrefix,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingSeededEnrollment) {
    console.log(`  - CICT roster already seeded for ${termLabel}; skipping enrollment import.`);
    return;
  }

  const enrollments: Array<Record<string, unknown>> = [];
  const paymentRows: Array<Record<string, unknown>> = [];
  const receiptRows: Array<Record<string, unknown>> = [];
  const historyRows: Array<Record<string, unknown>> = [];
  const auditRows: Array<Record<string, unknown>> = [];

  let sequence = 1;

  for (const section of program.sections) {
    section.students.forEach((student, index) => {
      const enrollmentId = randomUUID();
      const paymentId = randomUUID();
      const receiptId = randomUUID();
      const studentNumber = buildStudentNumber(program.code, section.section, sequence);
      const referenceNumber = buildReferenceNumber(section.section, sequence);
      const receiptNo = buildReceiptNo(sequence);
      const now = new Date();
      const studentType = section.yearLevel === 1 ? "INCOMING" : "REGULAR";
      const actorId = adminIds.ADMIN || adminIds.FACULTY || adminIds.OFFICER;

      enrollments.push({
        id: enrollmentId,
        studentType,
        studentName: student.name,
        studentNumber,
        program: program.program,
        yearLevel: section.yearLevel,
        sectionName: section.section,
        departmentFee: 50,
        paidAmount: 50,
        status: "ENROLLED",
        remarks: `Seeded AY ${academicYear} 2nd Semester roster`,
        submittedAt: now,
        approvedAt: now,
        paidAt: now,
        sectionAssignedAt: now,
        enrolledAt: now,
        createdAt: now,
        updatedAt: now,
        departmentId: department.id,
      });

      paymentRows.push({
        id: paymentId,
        amount: 50,
        method: "CASH",
        status: "POSTED",
        referenceNumber,
        postedAt: now,
        createdAt: now,
        enrollmentId,
        cashierId: adminIds.OFFICER,
      });

      receiptRows.push({
        id: receiptId,
        receiptNo,
        payerName: student.name,
        issuedAt: now,
        remarks: `Seed receipt for ${termLabel}`,
        createdAt: now,
        paymentId,
        issuedById: adminIds.OFFICER,
      });

      historyRows.push({
        id: randomUUID(),
        fromStatus: null,
        toStatus: "ENROLLED",
        note: `Seeded ${termLabel} enrollment import`,
        createdAt: now,
        enrollmentId,
        actorId,
      });

      auditRows.push({
        id: randomUUID(),
        action: "SEED_ENROLLMENT_IMPORTED",
        targetType: "CictEnrollment",
        targetId: enrollmentId,
        metadata: {
          termLabel,
          studentNumber,
          section: section.section,
          index,
        },
        createdAt: now,
        actorId,
      });

      sequence += 1;
    });
  }

  for (const [index, chunk] of chunkArray(enrollments, 100).entries()) {
    await prisma.cictEnrollment.createMany({ data: chunk, skipDuplicates: true });
    console.log(`  - Enrollments seeded: ${Math.min((index + 1) * 100, enrollments.length)}/${enrollments.length}`);
  }

  for (const [index, chunk] of chunkArray(paymentRows, 100).entries()) {
    await prisma.cictCashierPayment.createMany({ data: chunk, skipDuplicates: true });
    console.log(`  - Payments seeded: ${Math.min((index + 1) * 100, paymentRows.length)}/${paymentRows.length}`);
  }

  for (const [index, chunk] of chunkArray(receiptRows, 100).entries()) {
    await prisma.cictReceipt.createMany({ data: chunk, skipDuplicates: true });
    console.log(`  - Receipts seeded: ${Math.min((index + 1) * 100, receiptRows.length)}/${receiptRows.length}`);
  }

  for (const [index, chunk] of chunkArray(historyRows, 100).entries()) {
    await prisma.cictEnrollmentStatusHistory.createMany({ data: chunk, skipDuplicates: true });
    console.log(`  - Status history seeded: ${Math.min((index + 1) * 100, historyRows.length)}/${historyRows.length}`);
  }

  for (const [index, chunk] of chunkArray(auditRows, 100).entries()) {
    await prisma.cictAuditEvent.createMany({ data: chunk, skipDuplicates: true });
    console.log(`  - Audit events seeded: ${Math.min((index + 1) * 100, auditRows.length)}/${auditRows.length}`);
  }

  console.log(`  - Seeded ${enrollments.length} CICT enrollments for ${termLabel}`);
}

async function main() {
  console.log("🌱 Seeding database...\n");

  await seedCategories();
  await seedCictData();

  console.log("\n✅ Database seeding/sync completed!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
