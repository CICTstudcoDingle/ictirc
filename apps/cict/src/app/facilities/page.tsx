import { Monitor, Wifi, Server, Projector, Laptop, Shield } from "lucide-react";
import { CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

const facilities = [
  {
    name: "Computer Laboratory 1",
    description: "Main programming and software development laboratory equipped with high-performance workstations, dual monitors, and the latest development tools and IDEs.",
    icon: <Monitor className="w-8 h-8 text-maroon" />,
    specs: ["40 Workstations", "Intel i7 / 16GB RAM", "Windows & Linux Dual Boot", "Visual Studio, IntelliJ, VS Code"],
  },
  {
    name: "Computer Laboratory 2",
    description: "Networking and cybersecurity laboratory with dedicated networking equipment for hands-on training in network configuration, troubleshooting, and security testing.",
    icon: <Wifi className="w-8 h-8 text-maroon" />,
    specs: ["30 Workstations", "Cisco Routing Equipment", "Network Simulation Tools", "Packet Tracer, Wireshark"],
  },
  {
    name: "Server Room",
    description: "Climate-controlled server infrastructure supporting the department's web applications, research databases, and student project hosting environments.",
    icon: <Server className="w-8 h-8 text-maroon" />,
    specs: ["Rack-Mounted Servers", "UPS Backup Power", "Controlled Access", "Cloud Integration"],
  },
  {
    name: "Smart Classroom",
    description: "Modern interactive classroom with smart board, projector system, and audio-visual equipment for enhanced teaching and video conferencing capabilities.",
    icon: <Projector className="w-8 h-8 text-maroon" />,
    specs: ["Smart Board", "4K Projector", "Video Conferencing", "Surround Sound"],
  },
  {
    name: "Research & Innovation Hub",
    description: "A dedicated space for student and faculty research projects, capstone development, and innovation workshops with specialized hardware resources.",
    icon: <Laptop className="w-8 h-8 text-maroon" />,
    specs: ["IoT Development Kits", "3D Printing", "Arduino & Raspberry Pi", "Collaborative Workspace"],
  },
  {
    name: "Free Wi-Fi Campus Coverage",
    description: "High-speed internet connectivity across the entire CICT building, providing students with reliable access for online learning and research.",
    icon: <Shield className="w-8 h-8 text-maroon" />,
    specs: ["Fiber Optic Backbone", "Enterprise-Grade APs", "Student & Faculty VLANs", "Content Filtering"],
  },
];

export default function FacilitiesPage() {
  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation direction="up">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Our <span className="text-gold">Facilities</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              State-of-the-art equipment and infrastructure for modern IT education
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <ScrollAnimation key={facility.name} direction="up" staggerIndex={index} className="h-full">
                <div className="paper-card p-6 hover:shadow-lg transition-all h-full flex flex-col">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-maroon/10 rounded-xl flex items-center justify-center mb-4">
                    {facility.icon}
                  </div>

                  {/* Info */}
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {facility.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {facility.description}
                  </p>

                  {/* Specs */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Specifications</p>
                    <div className="flex flex-wrap gap-1.5">
                      {facility.specs.map((spec) => (
                        <span
                          key={spec}
                          className="inline-block px-2 py-1 text-[10px] font-mono text-gray-600 bg-gray-100 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
