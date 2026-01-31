import Link from "next/link";
import Image from "next/image";
import { Facebook, ExternalLink, Store, GraduationCap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/CICT_LOGO.png"
                alt="CICT Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <Image
                src="/images/ISUFST_LOGO.png"
                alt="ISUFST Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <div>
                <h3 className="font-bold text-maroon">ICTIRC</h3>
                <p className="text-xs text-gray-500">
                  ICT International Research Conference
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-sm mb-4">
              A scholarly publication platform by Iloilo State University of Fisheries 
              Science and Technology - College of Information and Communications Technology.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://isufst.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-maroon/5 hover:bg-maroon/10 text-maroon rounded-full text-xs font-medium transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                ISUFST Website
              </a>
              <a
                href="https://cictstore.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-amber-700 rounded-full text-xs font-medium transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                CICT Store
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/archive"
                  className="text-sm text-gray-600 hover:text-maroon transition-colors"
                >
                  Browse Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-sm text-gray-600 hover:text-maroon transition-colors"
                >
                  Submit Paper
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-maroon transition-colors"
                >
                  About ICTIRC
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-sm text-gray-600 hover:text-maroon transition-colors"
                >
                  Research Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li>ISUFST - CICT Department</li>
              <li>Dingle Campus, Iloilo</li>
              <li className="font-mono text-xs">ictirc@isufst.edu.ph</li>
            </ul>

            {/* Facebook Pages */}
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Follow Us</h4>
            <div className="space-y-2">
              <a
                href="https://www.facebook.com/profile.php?id=100068849010766"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
                CICT Official Page
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61587106231483"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
                Student Council
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} ICTIRC. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 font-mono">
              CC BY-ND 4.0 Licensed
            </p>
          </div>

          {/* Powered by Prism */}
          <a
            href="https://prism.jeffdev.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-full text-xs transition-all hover:shadow-lg"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="url(#prism-gradient)"
                className="opacity-80"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="url(#prism-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="url(#prism-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="prism-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a855f7" />
                  <stop offset="0.5" stopColor="#ec4899" />
                  <stop offset="1" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-medium">Powered by Prism Context Engine</span>
            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </footer>
  );
}
