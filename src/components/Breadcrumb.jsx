import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Breadcrumbs() {
  const location = useLocation();
  const mainColor = useSelector((state) => state.theme.mainColor);

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
      const formattedName = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        name: formattedName,
        path: "/" + segments.slice(0, index + 1).join("/")
      };
    });
  }, [location.pathname]);

  return (
    <nav className="flex items-center text-[17px] p-[2px] rounded-[6px] max-sm:text-[13px] max-sm:p-[2px]">
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.path} className="flex items-center">
          {index < breadcrumbs.length - 1 ? (
            <>
              <Link
                to={crumb.path}
                className="no-underline font-medium transition-colors duration-200 ease-in-out"
                style={{ color: mainColor }}
              >
                {crumb.name}
              </Link>

              <span className="mx-[6px] text-slate-400 dark:text-slate-500">
                &gt;
              </span>
            </>
          ) : (
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {crumb.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;