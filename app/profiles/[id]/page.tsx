import { redirect, notFound } from "next/navigation";
import { getServerUser, serverFetch } from "@/lib/api";
import Sidebar from "@/app/components/Sidebar";

export default async function ProfileDetailPage({ params }: { params: { id: string } }) {
  const user = await getServerUser();
  if (!user) redirect("/");

  let profile: any = null;
  try {
    const res = await serverFetch(`/api/profiles/${params.id}`);
    if (res.status === 404) notFound();
    if (res.ok) {
      const data = await res.json();
      profile = data.data;
    }
  } catch {}

  if (!profile) notFound();

  return (
    <div className="page-wrapper">
      <Sidebar user={user} />
      <main className="main-content">
        <div className="page-header">
          <div>
            <a href="/profiles" style={{ color: "var(--text-muted)", fontSize: 13, display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
              ← Back to Profiles
            </a>
            <h2 className="page-title">{profile.name}</h2>
          </div>
          <span className={`gender-badge ${profile.gender}`} style={{ fontSize: 14, padding: "5px 14px" }}>
            {profile.gender}
          </span>
        </div>

        <div className="card" style={{ maxWidth: 640 }}>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Full ID</span>
              <span className="detail-value td-id">{profile.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Name</span>
              <span className="detail-value">{profile.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Gender</span>
              <span className="detail-value">
                <span className={`gender-badge ${profile.gender}`}>{profile.gender}</span>
                <span style={{ marginLeft: 8, color: "var(--text-muted)", fontSize: 12 }}>
                  {(profile.gender_probability * 100).toFixed(0)}% confidence
                </span>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Age</span>
              <span className="detail-value">
                {profile.age}
                <span style={{ marginLeft: 8 }}>
                  <span className={`age-badge ${profile.age_group}`}>{profile.age_group}</span>
                </span>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Country</span>
              <span className="detail-value">
                {profile.country_name}
                <span style={{ color: "var(--text-muted)", fontSize: 12, marginLeft: 6 }}>
                  ({profile.country_id}) · {(profile.country_probability * 100).toFixed(0)}% confidence
                </span>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created At</span>
              <span className="detail-value">
                {new Date(profile.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
