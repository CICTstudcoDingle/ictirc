import { Calendar, MapPin, Users, Video, Mail, Award, Building2 } from "lucide-react";
import { prisma } from "@ictirc/database";

interface ConferenceData {
  venue?: string | null;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
}

export async function VenueSection() {
  // Fetch active conference
  const conference = await prisma.conference.findFirst({
    where: { isActive: true },
    select: {
      venue: true,
      location: true,
      startDate: true,
      endDate: true,
    },
  });

  // Fallback to latest published conference if none active
  const data: ConferenceData | null = conference || await prisma.conference.findFirst({
    where: { isPublished: true },
    orderBy: { startDate: "desc" },
    select: {
      venue: true,
      location: true,
      startDate: true,
      endDate: true,
    },
  });

  if (!data) {
    return null;
  }

  // Format dates
  const startDate = new Date(data.startDate);
  const endDate = data.endDate ? new Date(data.endDate) : null;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const dateString = endDate 
    ? `${formatDate(startDate).replace(`, ${startDate.getFullYear()}`, "")} – ${formatDate(endDate)}`
    : formatDate(startDate);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-maroon/10 rounded-full px-6 py-2 mb-4">
            <Building2 className="w-5 h-5 text-maroon" />
            <span className="text-sm font-semibold text-maroon uppercase tracking-wide">
              Conference Venue
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {data.venue || "Knowledge Hub Center"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Iloilo State University of Fisheries Science and Technology – Dingle Campus
          </p>
          <p className="text-lg text-gray-500 mt-2">
            {dateString}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-maroon/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-maroon" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
              <p className="text-gray-600">{data.location || "Dingle, Iloilo, Philippines"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-maroon/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-maroon" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Format</h3>
              <p className="text-gray-600">Hybrid (In-person & Virtual)</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-maroon/10 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-maroon" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Contact</h3>
              <a href="mailto:irjict@gmail.com" className="text-maroon hover:underline">
                irjict@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
