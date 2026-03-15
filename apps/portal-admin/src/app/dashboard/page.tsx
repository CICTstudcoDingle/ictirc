import { prisma } from "@ictirc/database";
import { Users, GraduationCap, Briefcase, Megaphone, Calendar } from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboard() {
  let stats = {
    totalUsers: 0,
    students: 0,
    faculty: 0,
    alumni: 0,
    announcements: 0,
    events: 0,
  };

  try {
    const currentYear = new Date().getFullYear();
    const [totalUsers, students, faculty, alumni, announcements, events] =
      await Promise.all([
        prisma.portalProfile.count({ where: { isActive: true } }),
        prisma.portalProfile.count({
          where: { userType: "STUDENT", isActive: true },
        }),
        prisma.portalProfile.count({
          where: { userType: "FACULTY", isActive: true },
        }),
        prisma.portalProfile.count({
          where: {
            OR: [
              { userType: "ALUMNI", isActive: true },
              {
                userType: "STUDENT",
                isActive: true,
                graduationYear: { lte: currentYear, not: null },
              },
            ],
          },
        }),
        prisma.portalAnnouncement.count(),
        prisma.portalEvent.count(),
      ]);

    stats = { totalUsers, students, faculty, alumni, announcements, events };
  } catch {
    // Tables might not exist yet
  }

  const statCards = [
    {
      label: "Total Members",
      value: stats.totalUsers,
      icon: Users,
      color: "text-maroon bg-maroon/5",
    },
    {
      label: "Students",
      value: stats.students,
      icon: GraduationCap,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Faculty",
      value: stats.faculty,
      icon: Briefcase,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Alumni",
      value: stats.alumni,
      icon: Users,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Announcements",
      value: stats.announcements,
      icon: Megaphone,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Events",
      value: stats.events,
      icon: Calendar,
      color: "text-cyan-600 bg-cyan-50",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Portal Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of the CICT Tech Portal management.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="/dashboard/announcements"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-maroon/5 text-maroon hover:bg-maroon/10 transition-colors text-sm font-medium"
          >
            <Megaphone className="w-4 h-4" />
            Create Announcement
          </a>
          <a
            href="/dashboard/events"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <Calendar className="w-4 h-4" />
            Create Event
          </a>
          <a
            href="/dashboard/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-sm font-medium"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </a>
        </div>
      </div>
    </div>
  );
}
