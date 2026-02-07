import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Video, Award } from "lucide-react";
import { Button, CircuitBackground } from "@ictirc/ui";
import { prisma } from "@ictirc/database";

export async function ConferenceHeroBanner() {
  // Fetch active conference
  const conference = await prisma.conference.findFirst({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      fullName: true,
      description: true,
      theme: true,
      startDate: true,
      endDate: true,
      location: true,
    },
  });

  // Fallback to upcoming/latest conference
  const data = conference || await prisma.conference.findFirst({
    where: { isPublished: true },
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      name: true,
      fullName: true,
      description: true,
      theme: true,
      startDate: true,
      endDate: true,
      location: true,
    },
  });

  if (!data) {
    return null;
  }

  // Format dates
  const startDate = new Date(data.startDate);
  const endDate = data.endDate ? new Date(data.endDate) : null;
  
  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const dateString = endDate 
    ? `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${endDate.getDate()}, ${endDate.getFullYear()}`
    : formatDateShort(startDate);

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-maroon to-gray-900 text-white py-20 md:py-32 overflow-hidden">
      <CircuitBackground variant="default" animated />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Conference Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold text-white">
              Approved and Endorsed by RASUC
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {data.name}
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 text-red-100">
            {data.fullName || data.name}
          </h2>

          {/* Event Details */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10 text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-300" />
              <span>{dateString}</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-red-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-300" />
              <span>{data.location || "Dingle, Iloilo, Philippines"}</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-red-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-red-300" />
              <span className="font-semibold">Hybrid Event</span>
            </div>
          </div>

          <p className="text-xl text-red-100 mb-10 max-w-3xl mx-auto">
            {data.description || "This is a Hybrid (In-person and virtual) conference. To present oral or poster papers virtually, please select \"Online Presentation\" in the registration system."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit">
              <Button size="lg" className="w-full sm:w-auto">
                Submit Your Research
              </Button>
            </Link>
            <Link href="/archive">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                View Archive
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
