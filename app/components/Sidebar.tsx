"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface User {
  username: string;
  avatar_url: string;
  role: string;
}

interface SidebarProps {
  user: User;
}

const navLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/profiles",
    label: "Profiles",
    icon: (
      <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Search",
    icon: (
      <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    href: "/account",
    label: "Account",
    icon: (
      <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Insighta <span>Labs+</span></h1>
        <p>Profile Intelligence</p>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Navigation</span>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${pathname.startsWith(link.href) ? "active" : ""}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-user">
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt={user.username} />
        ) : (
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-elevated)", border: "2px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
            {user.username[0].toUpperCase()}
          </div>
        )}
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">@{user.username}</div>
          <div className="sidebar-user-role">{user.role}</div>
        </div>
      </div>
    </aside>
  );
}
