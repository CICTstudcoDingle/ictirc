import { Award, ExternalLink } from "lucide-react";
import Image from "next/image";
import { CircuitBackground } from "@ictirc/ui";

export const metadata = {
  title: "Sponsors & Partners - 2026 IRCICT",
  description: "Organizations and institutions supporting the 2026 2nd International Research Conference in Information Communications Technology",
};

export default function SponsorsPage() {
  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-12 md:py-20 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Sponsors & <span className="text-gold">Partners</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Organizations supporting the advancement of ICT research and innovation
          </p>
        </div>
      </section>

        {/* Organizers Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Organized By
              </h2>
              <p className="text-lg text-gray-600">
                Leading institutions in ICT education and research
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* CICT ISUFST */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-maroon/10 rounded-full flex items-center justify-center mb-6">
                    <Image
                      src="/images/CICT_LOGO.png"
                      alt="CICT Logo"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    College of Information and Communications Technology (CICT)
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Iloilo State University of Fisheries Science and Technology – Dingle Campus
                  </p>
                  <span className="inline-block px-4 py-2 bg-maroon/10 text-maroon rounded-full text-sm font-semibold">
                    Primary Organizer
                  </span>
                </div>
              </div>

              {/* University of Brawijaya */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Image
                      src="/images/UB LOGO (1).png"
                      alt="University of Brawijaya Logo"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    University of Brawijaya
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Malang, Indonesia
                  </p>
                  <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    Major Partner
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supporting Organizations */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                In Cooperation With
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* International Linkages Affairs Office */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src="/images/isufst dingle.jpg"
                    alt="ISUFST Dingle"
                    width={64}
                    height={64}
                    className="object-contain rounded-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  International Linkages Affairs Office
                </h3>
                <p className="text-sm text-gray-600">ISUFST – Dingle Campus</p>
              </div>

              {/* Research and Development */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src="/images/isufst dingle.jpg"
                    alt="ISUFST Dingle"
                    width={64}
                    height={64}
                    className="object-contain rounded-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Research and Development
                </h3>
                <p className="text-sm text-gray-600">ISUFST – Dingle Campus</p>
              </div>

              {/* RASUC */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src="/images/rasuc logo.png"
                    alt="RASUC Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Regional State Universities and Colleges Association (RASUC)
                </h3>
                <p className="text-sm text-gray-600">Conference Endorsement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Become a Sponsor CTA */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-br from-maroon to-red-900 rounded-2xl shadow-2xl p-8 md:p-12 text-center text-white overflow-hidden">
              <CircuitBackground variant="subtle" animated />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Become a Sponsor
                </h2>
                <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
                  Support the advancement of ICT research and innovation by partnering with us for the 2026 IRCICT conference.
                </p>
                <a
                  href="/about/#contact"
                  className="inline-flex items-center gap-2 bg-white text-maroon px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  Contact Us
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}
