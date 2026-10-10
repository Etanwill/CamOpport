import Link from "next/link";
import { MapPin, Mail, Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo-icon.png" alt="Unbound" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-display font-bold text-xl text-white">
                Un<span className="text-primary-400">bound</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              The #1 platform for opportunities in Cameroon. Jobs, competitions, quizzes and more — all 100% Cameroonian.
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
              <MapPin size={13} />
              <span>Made in Cameroon 🇨🇲</span>
            </div>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"><Twitter size={15} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"><Linkedin size={15} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"><Facebook size={15} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm">
              {["Jobs & Gigs", "Competitions", "Quizzes", "Leaderboard", "Internships"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "For Companies", "Blog", "Contact", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <Mail size={12} />
              <span>hello@unbound.cm</span>
            </div>
          </div>
        </div>

        {/* Cameroon flag stripe */}
        <div className="flex h-1 rounded-full overflow-hidden mb-4">
          <div className="flex-1 bg-green-600" />
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-yellow-400" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <span>© 2024 Unbound. All rights reserved.</span>
          <span className="mt-1 sm:mt-0">Built with ❤️ for Cameroon 🇨🇲</span>
        </div>
      </div>
    </footer>
  );
}