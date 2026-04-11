import { Mail, User } from "lucide-react";
import { CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { facultyData, totalFaculty } from "@/data/faculty";

export default function FacultyPage() {
  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation direction="up">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Faculty & <span className="text-gold">Staff</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Meet our dedicated team of educators and researchers
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-mono text-gold mt-4">
              <span>{totalFaculty} Faculty Members</span>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyData.map((member, index) => (
              <ScrollAnimation key={index} direction="up" staggerIndex={index} className="h-full">
                <div className="paper-card p-6 hover:shadow-lg transition-all h-full flex flex-col">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-gradient-to-br from-maroon/20 to-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-maroon/60" />
                  </div>

                  {/* Info */}
                  <div className="text-center flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs font-mono text-gold bg-gold/10 inline-block px-2 py-0.5 rounded mb-2">
                      {member.position}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">{member.title}</p>
                    <p className="text-xs text-gray-400">{member.specialization}</p>
                  </div>

                  {/* Email */}
                  {member.email && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-1.5 text-xs text-maroon hover:text-maroon-600 transition-colors font-mono"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {member.email}
                      </a>
                    </div>
                  )}
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
