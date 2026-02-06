import { Users, Mail } from "lucide-react";
import { CircuitBackground } from "@ictirc/ui";

export const metadata = {
  title: "Organizing Committee - 2026 IRCICT",
  description: "Meet the organizing committee of the 2026 2nd International Research Conference in Information Communications Technology",
};

export default function CommitteesPage() {
  const committee = [
    {
      position: "Overall Chair",
      members: ["DR. RENANTE A. DIAMANTE"],
    },
    {
      position: "Secretariat",
      members: [
        "TEDDY S. FUENTIVILLA, MIT",
        "ROWENA S. BORCELO, MPA",
        "JEZZA MAE V. CATIQUESTA",
      ],
    },
    {
      position: "Co-chair",
      members: ["DR. MUHAMMAD ALI FAUZI"],
    },
    {
      position: "IT Chair",
      members: ["DR. GLENN C. TABIA"],
    },
    {
      position: "IT Co-chair",
      members: ["REBIE L. DANITARAS, MIT"],
    },
    {
      position: "Technical Chair",
      members: ["RENLY S. JADE LAUD, MIT"],
    },
    {
      position: "Technical Co-Chair",
      members: ["RIC JOHN PUYING"],
    },
    {
      position: "Research Facilitator",
      members: ["DR. GLENN DADOR"],
    },
    {
      position: "Research Co-Facilitator",
      members: ["SHAYLA BENDAÑA"],
    },
    {
      position: "Publicity Chair",
      members: ["DR. BENJAMIN L. CORNELIO, JR."],
    },
    {
      position: "Publicity Co-chair",
      members: ["JEFF EDRICK MARTINEZ"],
    },
  ];

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-12 md:py-20 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Organizing <span className="text-gold">Committee</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            2026 2nd International Research Conference in Information Communications Technology
          </p>
          <p className="text-gray-400 mt-2">
            March 3 – 4, 2026
          </p>
        </div>
      </section>

        {/* Committee Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  2026 Organizing Committee
                </h2>

                <div className="space-y-6">
                  {committee.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="sm:w-1/3 mb-2 sm:mb-0">
                        <h3 className="text-lg font-semibold text-maroon">
                          {item.position}
                        </h3>
                      </div>
                      <div className="sm:w-2/3">
                        {item.members.map((member, idx) => (
                          <p
                            key={idx}
                            className="text-gray-700 font-medium mb-1 last:mb-0"
                          >
                            {member}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Information */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-maroon" />
                    <span className="text-lg">
                      Official Email:{" "}
                      <a
                        href="mailto:irjict@gmail.com"
                        className="text-maroon hover:underline font-semibold"
                      >
                        irjict@gmail.com
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}
