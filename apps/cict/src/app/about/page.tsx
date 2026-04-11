import Link from "next/link";
import { Mail, MapPin, Phone, Smartphone, BookOpen, Target, Eye } from "lucide-react";
import { Button, CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

export default function AboutPage() {
  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      {/* Hero - Dark with Circuit Texture */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation direction="up">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              About <span className="text-gold">CICT</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              College of Information and Communication Technology
            </p>
            <p className="text-sm text-gray-400 mt-2">
              ISUFST — Dingle Campus, Iloilo
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimation direction="up" staggerIndex={0} className="h-full">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-maroon hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-maroon" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Our Mission
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To provide quality and relevant ICT education that produces competent, innovative, and socially responsible IT professionals who can contribute to national and global development through research, community service, and industry collaboration.
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" staggerIndex={1} className="h-full">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-gold hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-amber-700" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Our Vision
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To be a leading center of excellence in ICT education, research, and innovation in Western Visayas, producing globally competitive graduates who drive technological advancement and societal progress.
                </p>
              </div>
            </ScrollAnimation>
          </div>

          {/* About Description */}
          <ScrollAnimation direction="right">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-maroon" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  About the Department
                </h2>
              </div>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p>
                  The College of Information and Communication Technology (CICT) at the Iloilo State University of Fisheries Science and Technology (ISUFST) — Dingle Campus is dedicated to producing world-class IT professionals. Our department offers comprehensive programs in Bachelor of Science in Information Technology (BSIT), Bachelor of Science in Computer Science (BSCS), and Associate in Computer Technology (ACT).
                </p>
                <p>
                  Through a blend of theoretical instruction and hands-on laboratory experience, our students develop the skills needed to thrive in the rapidly evolving technology landscape. Our faculty members are experienced educators and researchers who bring real-world expertise into the classroom.
                </p>
                <div className="bg-gray-50 p-4 rounded-md border-l-4 border-gold text-sm italic mt-4">
                  CICT is committed to fostering innovation, critical thinking, and ethical responsibility among its graduates, ensuring they are well-prepared to meet the demands of the global ICT industry.
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Contact - Split Layout */}
      <section id="contact" className="min-h-[60vh] flex flex-col md:flex-row">
        {/* Contact Info Side */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 relative overflow-hidden flex items-center justify-center p-8 lg:p-16">
          <CircuitBackground variant="subtle" animated className="opacity-30" />

          <div className="relative z-10 max-w-lg text-white">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Contact <span className="text-gold">Us</span>
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Get in touch with the CICT department for enrollment inquiries, academic concerns, or collaboration opportunities.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-gold mb-1">Address</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    ISUFST — College of ICT<br />
                    Dingle Campus<br />
                    Dingle, Iloilo, Philippines
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-gold mb-1">Email</h3>
                  <a href="mailto:cict_dingle@isufst.edu.ph" className="text-gray-300 hover:text-gold transition-colors text-sm block">
                    cict_dingle@isufst.edu.ph
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-gold mb-1">Phone</h3>
                  <p className="text-gray-300 text-sm">(033) 337 – 1544</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-gold mb-1">Mobile</h3>
                  <p className="text-gray-300 text-sm">+639634638274</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Side */}
        <div className="flex-1 relative h-[450px] md:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4156.179439375485!2d122.66068721081648!3d11.00121875496157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33af1776ffd9b7f1%3A0x2c4663ccaaf49fa8!2sIloilo%20State%20University%20of%20Fisheries%20Science%20and%20Technology%E2%80%93%20Dingle%20Campus!5e1!3m2!1sen!2sph!4v1769815322971!5m2!1sen!2sph"
            width="100%"
            height="100%"
            className="border-0"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="ISUFST Dingle Campus Location"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-maroon/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Interested in Our Programs?
          </h2>
          <Link href="/programs">
            <Button>Explore Programs</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
