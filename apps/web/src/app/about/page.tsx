import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, Smartphone, ExternalLink, BookOpen, ShieldCheck, Globe } from "lucide-react";
import { Button, CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { FeedbackSection } from "@/components/feedback/feedback-section";

export default function AboutPage() {
  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      {/* Hero - Dark with Circuit Texture */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation direction="up">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              About <span className="text-gold">IRJICT</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-4">
              International Research Journal on Information and Communications Technology
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-mono text-gold">
              <span>ISSN No.: 2960-3773</span>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 space-y-8">

          {/* Introduction Section */}
          <ScrollAnimation direction="right">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-maroon" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Advancing Digital Innovation
                </h2>
              </div>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p>
                  Advancing the frontiers of digital innovation, the International Research Journal for Information and Communications Technology (IRJICT) facilitates the open-access publication of peer-reviewed research. Our scope encompasses diverse fields, including Computer Science, Engineering, and Industrial Technology, ensuring global visibility for scholarly excellence.
                </p>
                <p>
                  Since its inception in 2023, IRJICT has bridged the gap between innovation and publication. Our dual-layer review process—involving both specialized peer reviewers and our editorial team—guarantees the highest caliber of content. To maximize research impact, every article is published with unrestricted free access for readers worldwide.
                </p>
                <div className="bg-gray-50 p-4 rounded-md border-l-4 border-gold text-sm italic mt-4">
                  Join a community of innovators. IRJICT follows a streamlined editorial process designed to uphold the highest academic standards. We are currently accepting online submissions from experts in Computer Science, Engineering, ICT, and Industrial Technology.
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Academic Integrity Section */}
          <ScrollAnimation direction="left">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-maroon" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Academic Integrity Plagiarism Policy
                </h2>
              </div>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p>
                  IRJICT maintains the highest standards of academic integrity. We implement rigorous plagiarism screening for all submissions during the initial review stage.
                </p>
                <p>
                  We recognize plagiarism not only as a violation of intellectual property and potential copyright infringement but also as a breach of ethical publishing agreements. By systematically vetting all manuscripts, we ensure compliance with institutional restrictions and uphold the originality of the scholarly record.
                </p>
              </div>
            </div>
          </ScrollAnimation>

          {/* Aim & Scope and Open Access Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimation direction="up" staggerIndex={0} className="h-full">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-maroon hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-maroon" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Our Aim & Scope
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  IRJICT empowers researchers in ICT and Engineering by providing an open-access platform for original, peer-reviewed contributions. We are committed to academic integrity and the pursuit of making cutting-edge research intuitive and accessible to the modern world.
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" staggerIndex={1} className="h-full">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-maroon hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-maroon" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Open Access Journal
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Knowledge shouldn&apos;t be locked behind a paywall. By making research freely available online, we empower individuals and accelerate societal progress. Today, even the world&apos;s top-tier journals are making this possible by lowering the financial barriers for both readers and contributing authors.
                </p>
              </div>
            </ScrollAnimation>
          </div>

        </div>
      </section>

      {/* Contact - Split Layout (Stackable on mobile) */}
      <section id="contact" className="min-h-[60vh] flex flex-col md:flex-row">
        {/* CONTACT INFO SIDE (Left - 100% on mobile, 50% on desktop) */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 relative overflow-hidden flex items-center justify-center p-8 lg:p-16">
          <CircuitBackground variant="subtle" animated className="opacity-30" />
          
          <div className="relative z-10 max-w-lg text-white">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Contact <span className="text-gold">Us</span>
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Get in touch with our editorial team for submissions, inquiries, or collaboration opportunities.
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
                    ISUFST - College of ICT<br />
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
                  <a href="mailto:irjict@isufst.edu.ph" className="text-gray-300 hover:text-gold transition-colors text-sm block">
                    irjict@isufst.edu.ph
                  </a>
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
        
        {/* MAP SIDE (Right - 100% on mobile, 50% on desktop) */}
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

      {/* Feedback Section */}
      <section id="feedback" className="py-16 md:py-20 bg-gray-50">
        <FeedbackSection />
      </section>

      {/* CTA */}
      <section className="py-12 bg-maroon/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Ready to Share Your Research?
          </h2>
          <Link href="/submit">
            <Button>Submit Your Paper</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
