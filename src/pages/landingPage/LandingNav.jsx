import { Moon, Sun, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingNav = ({ theme, toggleTheme, isScrolled }) => {
  const navClass = theme === 'light'
    ? (isScrolled ? 'bg-white/80 shadow-sm py-3' : 'bg-transparent py-5')
    : (isScrolled ? 'bg-slate-950/80 shadow-sm py-3' : 'bg-transparent py-5');

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${navClass}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Accusoft</span>
        </div>

        <div className="flex items-center gap-4 md:gap-8 font-medium">
          <div className="hidden lg:flex items-center gap-8 text-sm uppercase tracking-wide opacity-80">
            {/* <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#reports" className="hover:text-blue-600 transition-colors">Reporting</a> */}
            <Link to="/dashboard"
              className="hover:text-blue-600 transition-colors"
            >Get Started</Link>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all ${theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700 text-amber-400'}`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm font-bold">
            Try Free
          </button>
        </div>
      </div>
    </nav>
  );
};