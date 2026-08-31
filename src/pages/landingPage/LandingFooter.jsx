import { Leaf, Heart, Github, Linkedin, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const LandingFooter = ({ theme, subtextClass }) => {
  const mainColor = useSelector((state) => state.theme?.mainColor || "#334155");

  return (
    <footer className={`py-10 px-4 sm:px-6 border-t transition-colors mt-auto ${
      theme === "light" ? "bg-white border-slate-200/80" : "bg-slate-950 border-slate-850"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Brand statement */}
          <Link to="/" className="flex items-center gap-2.5">
            <div 
              className="p-1.5 rounded-xl text-white shadow-sm"
              style={{ backgroundColor: mainColor }}
            >
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Accusoft
            </span>
          </Link>

          {/* Compliance & Policy Nav Links */}
          <div className={`flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs sm:text-sm font-semibold ${subtextClass}`}>
            <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Sign In
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3.5">
            <a
              href="https://github.com/kumarjaikishan"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="GitHub"
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/dev-kishan/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-[#0a66c2] transition-colors"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://portfolio.battlefiesta.in/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-indigo-500 transition-colors"
              aria-label="Portfolio"
              title="Portfolio"
            >
              <Globe size={16} />
            </a>
          </div>
        </div>

        {/* Bottom copyright & author line */}
        <div className={`pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${subtextClass}`}>
          <p>© {new Date().getFullYear()} Accusoft • Expense Management. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart size={13} className="text-rose-500 fill-rose-500 animate-pulse inline" />
            <span>by</span>
            <a
              href="https://portfolio.battlefiesta.in/"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Jai Kishan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};