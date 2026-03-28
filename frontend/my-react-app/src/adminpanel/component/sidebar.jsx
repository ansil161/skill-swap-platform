import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

const NAV_ITEMS = [
  {
    to: "/admin",
    end: true,
    label: "Dashboard",
    icon: (
      <svg className="sidebar__icon" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5" />
      </svg>
    ),
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: (
      <svg className="sidebar__icon" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" fill="currentColor" />
        <path d="M2 13c0-2.21 2.686-4 6-4s6 1.79 6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: "/admin/swaps",
    label: "Swaps",
    icon: (
      <svg className="sidebar__icon" viewBox="0 0 16 16" fill="none">
        <path d="M3 5h10M10 2l3 3-3 3M13 11H3M6 8l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: "/admin/sessions",
    label: "Sessions",
    icon: (
      <svg className="sidebar__icon" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="2.5" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 6.5l2.5 2L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
 
      <div className="sidebar__brand">
        <div className="sidebar__logo">S</div>
        <div>
          <div className="sidebar__brand-name">SkillSwap</div>
          <div className="sidebar__brand-sub">Admin</div>
        </div>
      </div>

    
      <p className="sidebar__section-label">Menu</p>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, end, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              "sidebar__link" + (isActive ? " active" : "")
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

   
    
    </aside>
  );
}