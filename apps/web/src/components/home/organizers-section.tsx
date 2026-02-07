import Image from "next/image";
import { prisma } from "@ictirc/database";

export async function OrganizersSection() {
  // Fetch active conference organizers and partners
  const conference = await prisma.conference.findFirst({
    where: { isActive: true },
    select: {
      organizers: true,
      partners: true,
    },
  });

  // Fallback to latest published conference if none active
  const data = conference || await prisma.conference.findFirst({
    where: { isPublished: true },
    orderBy: { startDate: "desc" },
    select: {
      organizers: true,
      partners: true,
    },
  });

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sponsored and Organized By
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none text-center">
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong className="text-maroon">College of Information and Communications Technology (CICT)</strong><br />
              of Iloilo State University of Fisheries Science and Technology – Dingle Campus
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              and
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              <strong className="text-blue-700">University of Brawijaya</strong><br />
              Malang, Indonesia
            </p>

            <p className="text-gray-700 leading-relaxed">
              in cooperation of <strong>International Linkages Affairs Office</strong> and <strong>Research and Development</strong> of ISUFST – Dingle Campus
            </p>
          </div>
        </div>

        {/* Logos */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
          <div className="flex flex-col items-center">
            <Image
              src="/images/ISUFST_LOGO.png"
              alt="ISUFST Logo"
              width={140}
              height={140}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/images/CICT_LOGO.png"
              alt="CICT Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/images/UB LOGO (1).png"
              alt="Universitas Brawijaya Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
