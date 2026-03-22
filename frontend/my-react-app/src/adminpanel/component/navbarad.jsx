// admin/components/Navbar.jsx
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
        <span className="navbar__status-dot" />
        <span className="navbar__status-text">All systems operational</span>
        <div className="navbar__avatar" title="Admin">A</div>
      </div>
    </header>
  );
}