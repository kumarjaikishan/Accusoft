import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronRight } from "lucide-react";

function Breadcrumbs() {
  const location = useLocation();
  const mainColor = useSelector((state) => state.theme?.mainColor || "#4f46e5");

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
      const formattedName = segment
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        name: formattedName,
        path: "/" + segments.slice(0, index + 1).join("/")
      };
    });
  }, [location.pathname]);

  if (breadcrumbs.length === 0) {
    return (
      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
        Dashboard
      </span>
    );
  }

  return (
    <nav className="flex items-center text-xs sm:text-sm font-medium">
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.path} className="flex items-center">
          {index < breadcrumbs.length - 1 ? (
            <>
              <Link
                to={crumb.path}
                className="hover:underline transition-colors truncate max-w-[120px] sm:max-w-[200px]"
                style={{ color: mainColor }}
              >
                {crumb.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 mx-1 text-slate-400 dark:text-slate-500 shrink-0" />
            </>
          ) : (
            <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[140px] sm:max-w-[220px]">
              {crumb.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;