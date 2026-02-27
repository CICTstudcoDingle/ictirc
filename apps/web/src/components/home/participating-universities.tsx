"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@ictirc/ui";

// Data extracted from user documents
type University = {
  id: number;
  name: string;
  admin: string;
  role: string;
  logo: string;
  badge?: string;
  badgeColor?: string;
};

const UNIVERSITIES: University[] = [
  {
    id: 1,
    name: "Iloilo State University of Fisheries Science and Technology",
    admin: "Dr. Nordy D. Siason, Jr.",
    role: "University President",
    logo: "/images/ISUFST_LOGO.png",
    badge: "Proprietary",
    badgeColor: "#022157",
  },
  {
    id: 2,
    name: "Iloilo Science and Technology University - Miagao Campus",
    admin: "Dr. Ramon N. Emmanuel, Jr.",
    role: "Campus Administrator",
    logo: "/images/ISAT-U.png",
  },
  {
    id: 3,
    name: "Iloilo Science and Technology University - Barotac Nuevo Campus",
    admin: "Nilde S. Aderete, Ed.D.",
    role: "Campus Administrator",
    logo: "/images/ISAT-U.png",
  },
  {
    id: 4,
    name: "Northern Iloilo State University - Batad Campus",
    admin: "Dr. Bobby D. Gerardo",
    role: "University President",
    logo: "/images/NISU.png",
  },
  {
    id: 5,
    name: "Guimaras State University",
    admin: "Dr. Lilian Diana B. Parreño",
    role: "University President",
    logo: "/images/GSU.png",
  },
  {
    id: 9,
    name: "Siquijor State College",
    admin: "STEVEN J. SUMAYLO, Ph.D.",
    role: "SUC President II",
    logo: "/images/SSC.jpg",
  },
  {
    id: 6,
    name: "University of Antique",
    admin: "Dr. Pablo S. Crespo Jr.",
    role: "University President",
    logo: "/images/UA.jpg",
  },
  {
    id: 7,
    name: "Aklan State University",
    admin: "Dr. Jeffrey A. Clarin",
    role: "University President",
    logo: "/images/ASU.png",
  },
  {
    id: 8,
    name: "West Visayas State University - Lambunao Campus",
    admin: "Dr. Cheryll L. Dawal",
    role: "Campus Administrator",
    logo: "/images/WVSU.jpg",
  },
];

export function ParticipatingUniversities() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h3 className="text-xl font-bold text-gray-900">
          In Cooperation With
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Leading academic institutions participating in the research consortium
        </p>
      </div>

      <div className="relative w-full overflow-hidden group">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Marquee Container */}
        {/* Added hover:pause to let users read names */}
        <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
          {/* First set of items */}
          <div className="flex items-center gap-16 mx-8">
            {UNIVERSITIES.map((uni) => (
              <UniversityItem key={`a-${uni.id}`} university={uni} />
            ))}
          </div>
          {/* Duplicate set for seamless looping */}
          <div className="flex items-center gap-16 mx-8" aria-hidden="true">
            {UNIVERSITIES.map((uni) => (
              <UniversityItem key={`b-${uni.id}`} university={uni} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UniversityItem({ university }: { university: University }) {
  const isIsufst = university.id === 1;

  return (
    <div className="flex items-center gap-5 min-w-[340px] group transition-all duration-300">
      {/* Logo container - Dynamic sizing for ISUFST */}
      <div
        className={cn(
          "relative shrink-0 flex items-center justify-center transition-all duration-300",
          isIsufst ? "w-32 h-32" : "w-24 h-24"
        )}
      >
        <Image
          src={university.logo}
          alt={university.name}
          width={isIsufst ? 140 : 100}
          height={isIsufst ? 140 : 100}
          className={cn(
            "object-contain w-full h-full drop-shadow-md group-hover:scale-110 transition-transform duration-300",
            isIsufst && "scale-125" // Initial scale boost for ISUFST
          )}
        />
      </div>
      
      {/* Text Info */}
      <div className="flex flex-col">
        <h4 className={cn(
          "text-sm font-bold leading-tight mb-1 transition-colors line-clamp-2",
          isIsufst ? "text-maroon text-base" : "text-maroon group-hover:text-maroon-600"
        )}>
          {university.name}
          {university.badge && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ml-2 align-middle"
              style={{ backgroundColor: university.badgeColor }}
            >
              {university.badge}
            </span>
          )}
        </h4>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-gray-900">
            {university.admin}
          </p>
          <p className="text-[10px] font-bold text-gold uppercase tracking-wider">
            {university.role}
          </p>
        </div>
      </div>
    </div>
  );
}
