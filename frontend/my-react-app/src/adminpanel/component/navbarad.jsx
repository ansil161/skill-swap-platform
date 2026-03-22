import { useLocation } from "react-router-dom";
import "../styles/navbarad.css";

const PAGE_LABELS = {
  "/admin":          "Dashboard",
  "/admin/users":    "Users",
  "/admin/swaps":    "Swaps",
  "/admin/sessions": "Sessions",
};

export default function Navbar() {
  const { pathname } = useLocation();
  const pageTitle = PAGE_LABELS[pathname] ?? "Admin";

  return (
    <header className="navbar">
      <div className="navbar__left">
        <p className="navbar__page-title">{pageTitle}</p>
        <p className="navbar__breadcrumb">
          <span>SkillSwap</span> / {pageTitle}
        </p>
      </div>

      <div className="navbar__right">
        {/* Status */}
        <div className="navbar__status">
          <span className="navbar__status-dot" />
          All systems operational
        </div>

        {/* Bell */}
        <button className="navbar__bell" aria-label="Notifications">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M8 1a5 5 0 0 0-5 5v3l-1.5 2h13L13 9V6a5 5 0 0 0-5-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="navbar__avatar" title="Admin">A</div>
      </div>
    </header>
  );
}