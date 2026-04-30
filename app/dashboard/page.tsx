import { redirect } from "next/navigation";
import { getServerUser, serverFetch } from "@/lib/api";
import Sidebar from "@/app/components/Sidebar";

async function getDashboardStats() {
  try {
    const res = await serverFetch("/api/profiles?page=1&limit=1");
    const data = await res.json();
    return {
      total: data.total ?? 0,
      total_pages: data.total_pages ?? 0,
    };
  } catch {
    return { total: 0, total_pages: 0 };
  }
}

async function getRecentProfiles() {
  try {
    const res = await serverFetch("/api/profiles?page=1&limit=5&sort_by=created_at&order=desc");
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const user = await getServerUser();
  if (!user) redirect("/");

  const [stats, recentProfiles] = await Promise.all([
    getDashboardStats(),
    getRecentProfiles(),
  ]);

  return (
    <div className="page-wrapper">
      <Sidebar user={user} />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">Welcome back, @{user.username} 👋</h2>
            <p className="page-subtitle">Here&apos;s what&apos;s happening in Insighta Labs+</p>
          </div>
          <span className={`role-badge ${user.role}`}>{user.role}</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Profiles</div>
            <div className="stat-value">{stats.total.toLocaleString()}</div>
            <div className="stat-sub">in the database</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Pages</div>
            <div className="stat-value">{stats.total_pages}</div>
            <div className="stat-sub">at 10 per page</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Your Role</div>
            <div className="stat-value" style={{ fontSize: 20, textTransform: "capitalize" }}>{user.role}</div>
            <div className="stat-sub">{user.role === "admin" ? "Full access" : "Read-only access"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Access Method</div>
            <div className="stat-value" style={{ fontSize: 16 }}>Web Portal</div>
            <div className="stat-sub">HTTP-only session</div>
          </div>
        </div>

        <div className="table-wrapper">
          <div className="table-header">
            <div>
              <div className="table-title">Recent Profiles</div>
              <div className="table-count">Latest 5 entries</div>
            </div>
            <a href="/profiles" className="btn btn-secondary btn-sm">View all →</a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Country</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentProfiles.length === 0 ? (
                <tr className="loading-row"><td colSpan={5}>No profiles found</td></tr>
              ) : recentProfiles.map((p: any) => (
                <tr key={p.id}>
                  <td>
                    <a href={`/profiles/${p.id}`} style={{ color: "var(--text-accent)" }}>
                      {p.name}
                    </a>
                  </td>
                  <td>
                    <span className={`gender-badge ${p.gender}`}>{p.gender}</span>
                  </td>
                  <td>{p.age} <span style={{ color: "var(--text-muted)", fontSize: 11 }}>({p.age_group})</span></td>
                  <td>{p.country_name}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
