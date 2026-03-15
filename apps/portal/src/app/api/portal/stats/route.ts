import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database";

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();

    // Count by userType in PortalProfile
    const [students, faculty, alumni] = await Promise.all([
      prisma.portalProfile.count({
        where: { userType: "STUDENT", isActive: true },
      }),
      prisma.portalProfile.count({
        where: { userType: "FACULTY", isActive: true },
      }),
      prisma.portalProfile.count({
        where: {
          OR: [
            // Explicit alumni
            { userType: "ALUMNI", isActive: true },
            // Auto-detected: graduated (graduation year <= current year)
            {
              userType: "STUDENT",
              isActive: true,
              graduationYear: { lte: currentYear, not: null },
            },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      students,
      faculty,
      alumni,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch portal stats:", error);
    return NextResponse.json(
      { students: 0, faculty: 0, alumni: 0, updatedAt: null },
      { status: 500 }
    );
  }
}
