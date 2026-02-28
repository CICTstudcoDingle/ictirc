import Link from "next/link";
import Image from "next/image";
import { Mail, Globe } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#5c0202] border-t border-white/10 mt-auto overflow-hidden text-white z-10">
      {/* Subtle texture overlay using CSS patterns */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]"
      />

      {/* Radial Spotlight & Sheen */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 to-black/40" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/irjict-logo.png"
                alt="IRJICT Logo"
                width={40}
                height={40}
                className="w-10 h-10 bg-white rounded-full p-0.5"
              />
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">ICTIRC Documentation</h3>
                <p className="text-xs text-white/70">
                  Official Technical Resource
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-200 max-w-sm mb-4">
              Comprehensive guide for the International Conference on Technology, Innovation, Research, and Creativity platform.
            </p>
          </div>

          {/* Docs Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Documentation</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li><Link href="/getting-started" className="hover:text-gold transition-colors">Getting Started</Link></li>
              <li><Link href="/admin" className="hover:text-gold transition-colors">Admin Guide</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <a href="mailto:irjict@isufst.edu.ph" className="hover:text-white font-mono text-xs">irjict@isufst.edu.ph</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <a href="mailto:cict_dingle@isufst.edu.ph" className="hover:text-white font-mono text-xs">cict_dingle@isufst.edu.ph</a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-gold" />
                <a href="https://isufst.edu.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xs">isufst.edu.ph</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            © {currentYear} ISUFST-CICT. All rights reserved.
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
             <span className="text-xs text-white/70 font-medium">Powered by CICT-ISUFST</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
