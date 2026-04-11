import { Mail, User, Award } from "lucide-react";
import { CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { dean, faculty, staff, totalFaculty, totalStaff } from "@/data/faculty";

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
              The dedicated educators and administrators of CICT
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-mono text-gold">
                <span>{totalFaculty} Faculty Members</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-mono text-gold">
                <span>{totalStaff} Staff</span>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 space-y-14">

          {/* Dean */}
          {dean && (
            <ScrollAnimation direction="up">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-gold rounded-full" />
                  College Administration
                </h2>
                <div className="paper-card p-6 md:p-8 hover:shadow-xl transition-all">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-maroon to-maroon/60 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-maroon/20">
                      <Award className="w-12 h-12 text-gold" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-mono font-bold text-gold bg-gold/10 inline-block px-3 py-1 rounded-full mb-2">
                        {dean.position}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{dean.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{dean.title}</p>
                      {dean.email && (
                        <a
                          href={`mailto:${dean.email}`}
                          className="inline-flex items-center gap-1.5 text-sm text-maroon hover:underline font-mono"
                        >
                          <Mail className="w-4 h-4" />
                          {dean.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          )}

          {/* Faculty */}
          <ScrollAnimation direction="up">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-maroon rounded-full" />
                Faculty Members
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {faculty.map((member, index) => (
                  <div
                    key={index}
                    className="paper-card p-5 hover:shadow-lg transition-all flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-maroon/20 to-gold/20 rounded-full flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-maroon/60" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-xs font-mono text-gold bg-gold/10 inline-block px-2 py-0.5 rounded mb-1">
                      {member.title}
                    </p>
                    <p className="text-xs text-gray-500">{member.position}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Staff */}
          <ScrollAnimation direction="up">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-gray-400 rounded-full" />
                Administrative Staff
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {staff.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-xs text-gray-500">{member.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

        </div>
      </section>
    </div>
  );
}
