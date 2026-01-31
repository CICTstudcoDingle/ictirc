import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { Button, CircuitBackground } from "@ictirc/ui";

export default function AboutPage() {
  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      {/* Hero - Dark with Circuit Texture */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            About ICTIRC
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            The Information and Communications Technology International Research
            Conference is a premier venue for ICT research publication.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <div className="prose prose-lg text-gray-600">
            <p>
              ICTIRC aims to provide a high-quality, peer-reviewed platform for
              researchers, academics, and practitioners to share their innovations
              in information and communications technology.
            </p>
            <p>
              Hosted by the Iloilo State University of Fisheries Science and Technology 
              College of Information and Communications Technology (ISUFST-CICT), we
              are committed to advancing ICT research in the Philippines and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Peer Review Process */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Peer Review Process
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: 1,
                title: "Submission",
                description: "Authors submit manuscripts through our online portal.",
              },
              {
                step: 2,
                title: "Double-Blind Review",
                description: "Expert reviewers evaluate papers without knowing author identities.",
              },
              {
                step: 3,
                title: "Publication",
                description: "Accepted papers receive DOIs and are indexed globally.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-10 h-10 bg-maroon text-white rounded-full flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Contact Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-maroon/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    ISUFST - College of ICT<br />
                    Dingle Campus<br />
                    Dingle, Iloilo, Philippines
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-maroon/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a href="mailto:ictirc@isufst.edu.ph" className="text-maroon hover:underline">
                    ictirc@isufst.edu.ph
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-maroon/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+63 (078) 123-4567</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden h-64 md:h-full md:min-h-[280px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4156.179439375485!2d122.66068721081648!3d11.00121875496157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33af1776ffd9b7f1%3A0x2c4663ccaaf49fa8!2sIloilo%20State%20University%20of%20Fisheries%20Science%20and%20Technology%E2%80%93%20Dingle%20Campus!5e1!3m2!1sen!2sph!4v1769815322971!5m2!1sen!2sph"
                width="100%"
                height="100%"
                className="border-0 min-h-[280px]"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="ISUFST Dingle Campus Location"
              />
            </div>
          </div>
        </div>
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
