import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/api";
import Sidebar from "@/app/components/Sidebar";

export default async function AccountPage() {
  const user = await getServerUser();
  if (!user) redirect("/");

  return (
    <div className="page-wrapper">
      <Sidebar user={user} />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">Account</h2>
            <p className="page-subtitle">Your profile and session information</p>
          </div>
          <span className={`role-badge ${user.role}`}>{user.role}</span>
        </div>

        <div style={{ display: "grid", gap: 20, maxWidth: 640 }}>
          {/* User Card */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              {user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid var(--border-accent)" }}
                />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>@{user.username}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{user.email || "No email set"}</div>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Username</span>
                <span className="detail-value">@{user.username}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Role</span>
                <span className="detail-value">
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user.email || "—"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">User ID</span>
                <span className="detail-value td-id" style={{ fontSize: 12 }}>{user.id}</span>
              </div>
            </div>
          </div>

          {/* Permissions Card */}
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 16, color: "var(--text-primary)" }}>Permissions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Read profiles", allowed: true },
                { label: "Search profiles", allowed: true },
                { label: "Export to CSV", allowed: true },
                { label: "Create profiles", allowed: user.role === "admin" },
                { label: "Delete profiles", allowed: user.role === "admin" },
              ].map(({ label, allowed }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                  <span style={{ color: allowed ? "var(--green)" : "var(--red)", fontWeight: 700, fontSize: 16 }}>
                    {allowed ? "✓" : "✗"}
                  </span>
                  <span style={{ color: allowed ? "var(--text-primary)" : "var(--text-muted)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="btn btn-danger" style={{ width: "100%" }}>
              Sign out
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
