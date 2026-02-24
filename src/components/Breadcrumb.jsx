import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import "./breadcrumb.css";

function Breadcrumbs() {
  const location = useLocation();

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
    <nav className="breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.path} className="breadcrumb-item">
          {index < breadcrumbs.length - 1 ? (
            <>
              <Link to={crumb.path}>{crumb.name}</Link>
              <span className="separator">&gt;</span>
            </>
          ) : (
            <span className="active">{crumb.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;