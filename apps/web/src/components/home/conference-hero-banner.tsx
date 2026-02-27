import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Video, Award } from "lucide-react";
import { Button, CircuitBackground } from "@ictirc/ui";
import { prisma } from "@ictirc/database";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

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
      imageUrl: true,
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
      imageUrl: true,
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left max-w-xl xl:max-w-2xl">
          {/* Conference Badge */}
          <ScrollAnimation direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 shadow-sm">
                <Award className="w-5 h-5 text-gold" />
                <span className="text-sm font-semibold tracking-wide text-white">
                Approved and Endorsed by RASUC
              </span>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 leading-[1.15] text-white tracking-tight">
                {data.name.split(' ').map((word, i) => (
                  <span key={i} className={i === 0 ? "text-gold" : "text-white"}>{word} </span>
                ))}
            </h1>
              {/* Prevent duplicated titles */}
              {data.fullName && data.fullName !== data.name && (
                <h2 className="text-xl md:text-2xl lg:text-3xl font-medium mb-6 text-red-200/90 leading-snug">
                  {data.fullName}
                </h2>
              )}
          </ScrollAnimation>

          {/* Event Details */}
          <ScrollAnimation direction="up" delay={0.3}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-8 mb-10 text-base md:text-lg text-white/90">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span className="font-medium">{dateString}</span>
              </div>
                <div className="hidden sm:block w-1.5 h-1.5 bg-gold/50 rounded-full"></div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-gold" />
                  <span className="font-medium">{data.location || "Dingle, Iloilo, Philippines"}</span>
              </div>
                <div className="hidden sm:block w-1.5 h-1.5 bg-gold/50 rounded-full"></div>
                <div className="flex items-center gap-2.5">
                  <Video className="w-5 h-5 text-gold" />
                  <span className="font-bold text-white">Hybrid Event</span>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.4}>
              <div className="border-l-4 border-gold pl-6 mb-12">
                <p className="text-lg md:text-xl text-red-50/80 leading-relaxed font-light">
                  {data.description || "This is a Hybrid (In-person and virtual) conference. To present oral or poster papers virtually, please select \"Online Presentation\" in the registration system."}
                </p>
              </div>
          </ScrollAnimation>

          {/* CTA Buttons */}
          <ScrollAnimation direction="up" delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
              <Link href="/submit">
                  <Button size="lg" className="w-full sm:w-auto bg-maroon-600 hover:bg-maroon-700 text-white border border-maroon-500 shadow-[4px_4px_0px_0px_rgba(212,175,55,1)] transition-all hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(212,175,55,1)]">
                  Submit Your Research
                </Button>
              </Link>
              <Link href="/archive">
                  <Button size="lg" className="w-full sm:w-auto bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-colors">
                  View Archive
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
        </div>

          {/* Event Banner Image */}
          <ScrollAnimation direction="up" delay={0.4} className="hidden lg:block relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            <Image
              src={data.imageUrl || "/images/isufst dingle.jpg"}
              alt={`${data.name} Banner`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Subtle overlay for better blending with the dark theme */}
            <div className="absolute inset-0 bg-gradient-to-tr from-maroon/40 via-transparent to-transparent mix-blend-multiply" />
            <div className="absolute inset-0 border-2 border-white/10 rounded-2xl pointer-events-none" />
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
