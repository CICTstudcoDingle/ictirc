import Link from "next/link";
import Image from "next/image";

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
            <p className="text-sm text-gray-600 max-w-sm">
              A scholarly publication platform by Iloilo State University of Fisheries 
              Science and Technology - College of Information and Communications Technology.
            </p>
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
                  href="/search"
                  className="text-sm text-gray-600 hover:text-maroon transition-colors"
                >
                  Search Papers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>ISUFST - CICT Department</li>
              <li>Dingle Campus, Iloilo</li>
              <li className="font-mono text-xs">ictirc@isufst.edu.ph</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} ICTIRC. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 font-mono">
            CC BY-ND 4.0 Licensed
          </p>
        </div>
      </div>
    </footer>
  );
}
