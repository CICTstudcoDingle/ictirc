import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Calendar, MapPin, Users, Video, Mail, Award, Building2 } from "lucide-react";
import { Button, CircuitBackground } from "@ictirc/ui";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "2026 IRCICT - 2nd International Research Conference in Information Communications Technology",
  description: "March 3-4, 2026 | Hybrid Conference at ISUFST-Dingle Campus | Approved and endorsed by RASUC",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "2026 2nd International Research Conference in Information Communications Technology",
    "startDate": "2026-03-03T08:00:00+08:00",
    "endDate": "2026-03-04T17:00:00+08:00",
    "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "Knowledge Hub Center, ISUFST Dingle Campus",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dingle",
        "addressRegion": "Iloilo",
        "addressCountry": "Philippines"
      }
    },
    "description": "2nd International Research Conference in Information Communications Technology - A Hybrid Conference",
    "organizer": {
      "@type": "Organization",
      "name": "College of Information and Communications Technology, ISUFST - Dingle Campus",
      "url": "https://ictirc.isufst.edu.ph"
    }
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="pt-14 md:pt-16">
        {/* Hero Section */}
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
                2026 IRCICT
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 text-red-100">
                2nd International Research Conference in<br />Information Communications Technology
              </h2>

              {/* Event Details */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10 text-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-300" />
                  <span>March 3 – 4, 2026</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-red-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-300" />
                  <span>Dingle, Iloilo, Philippines</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-red-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-300" />
                  <span className="font-semibold">Hybrid Event</span>
                </div>
              </div>

              <p className="text-xl text-red-100 mb-10 max-w-3xl mx-auto">
                This is a Hybrid (In-person and virtual) conference. To present oral or poster papers virtually, please select "Online Presentation" in the registration system.
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

        {/* Venue Section */}
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
                Knowledge Hub Center
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Iloilo State University of Fisheries Science and Technology – Dingle Campus
              </p>
              <p className="text-lg text-gray-500 mt-2">
                March 3-4, 2026
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-maroon/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">Dingle, Iloilo, Philippines</p>
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

        {/* Organizers Section */}
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
                  width={100}
                  height={100}
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
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-maroon to-red-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Us at IRCICT 2026
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Be part of the premier international conference on ICT research and innovation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/submit">
                <Button size="lg" className="w-full sm:w-auto bg-white text-maroon hover:bg-gray-100">
                  Submit Research Paper
                </Button>
              </Link>
              <Link href="/committees">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  Meet the Committee
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
