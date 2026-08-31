import { Moon, Sun, Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const LandingNav = ({ theme, toggleTheme, isScrolled }) => {
  const mainColor = useSelector((state) => state.theme?.mainColor || "#334155");
  const isLogin = useSelector((state) => state.login?.islogin);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-xs py-2.5 sm:py-3"
          : "bg-transparent py-3.5 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div 
            className="p-2 rounded-xl text-white shadow-md transition-transform group-hover:scale-105"
            style={{ backgroundColor: mainColor }}
          >
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Accusoft
          </span>
        </Link>

        {/* Useful Pages Navigation Links */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
          <a href="/#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Features
          </a>
          <a href="/#reports" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Live Reports
          </a>
          <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Terms
          </Link>
        </div>

        {/* Actions (Theme & CTA) */}
        <div className="flex items-center gap-2 sm:gap-3.5 font-medium">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-amber-400 transition-colors cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            {theme === "light" ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Primary CTA / Dashboard Navigation */}
          <Link to={isLogin ? "/dashboard" : "/login"}>
            <button 
              className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 hover:scale-105 transition-all cursor-pointer"
              style={{ backgroundColor: mainColor }}
            >
              <span>{isLogin ? "Dashboard" : "Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};