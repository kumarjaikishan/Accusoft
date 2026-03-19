import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingFooter = ({ theme, subtextClass }) => {
    return (
        <footer className={`py-6 px-6 border-t transition-colors ${theme === 'light' ? 'bg-white border-slate-100' : 'bg-slate-950 border-slate-900'}`}>
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    <Link to="/" >
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Wallet className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Accusoft</span>
                        </div>
                    </Link>
                    <div className={`flex gap-8 text-sm font-medium ${subtextClass}`}>
                        <Link to="/privacy" className="hover:text-blue-600 transition-colors">
                            Privacy
                        </Link>

                        <Link to="/terms" className="hover:text-blue-600 transition-colors">
                            Terms
                        </Link>

                        {/* <Link to="/contact" className="hover:text-blue-600 transition-colors">
                            Contact
                        </Link> */}
                    </div>
                </div>
                <div className={`text-center pt-4 border-t border-slate-100 dark:border-slate-900 text-sm ${subtextClass}`}>
                    <p>© {new Date().getFullYear()} Accusoft. Built for smarter money management.</p>
                </div>
            </div>
        </footer >
    );
};