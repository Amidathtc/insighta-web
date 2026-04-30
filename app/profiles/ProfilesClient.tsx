"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: string;
}

interface ProfilesData {
  data: Profile[];
  page: number;
  total: number;
  total_pages: number;
  links: { next?: string | null; prev?: string | null };
}

interface Props {
  initialData: ProfilesData;
  searchParams: Record<string, string | undefined>;
  userRole: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function ProfilesClient({ initialData, searchParams, userRole }: Props) {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams();
    if (searchParams.gender) params.set("gender", searchParams.gender);
    if (searchParams.age_group) params.set("age_group", searchParams.age_group);
    if (searchParams.country_id) params.set("country_id", searchParams.country_id);
    if (searchParams.sort_by) params.set("sort_by", searchParams.sort_by);
    if (searchParams.order) params.set("order", searchParams.order);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/profiles?${params.toString()}`);
  }

  function setPage(p: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => { if (v && k !== "page") params.set(k, v); });
    params.set("page", String(p));
    router.push(`/profiles?${params.toString()}`);
  }

  async function handleExport() {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (searchParams.gender) params.set("gender", searchParams.gender);
      if (searchParams.age_group) params.set("age_group", searchParams.age_group);
      if (searchParams.country_id) params.set("country_id", searchParams.country_id);
      const res = await fetch(`/api/profiles/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `profiles_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Export failed. Please try again.");
    }
    setExporting(false);
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Profiles</h2>
          <p className="page-subtitle">{initialData.total.toLocaleString()} total profiles</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleExport} disabled={exporting}>
          {exporting ? "Exporting…" : "⬇ Export CSV"}
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select className="filter-select" value={searchParams.gender || ""} onChange={e => applyFilter("gender", e.target.value)}>
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select className="filter-select" value={searchParams.age_group || ""} onChange={e => applyFilter("age_group", e.target.value)}>
          <option value="">All Age Groups</option>
          <option value="child">Child</option>
          <option value="teenager">Teenager</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>
        <select className="filter-select" value={searchParams.sort_by || ""} onChange={e => applyFilter("sort_by", e.target.value)}>
          <option value="">Sort: Default</option>
          <option value="age">Sort: Age</option>
          <option value="created_at">Sort: Date</option>
          <option value="gender_probability">Sort: Probability</option>
        </select>
        <select className="filter-select" value={searchParams.order || ""} onChange={e => applyFilter("order", e.target.value)}>
          <option value="desc">Order: DESC</option>
          <option value="asc">Order: ASC</option>
        </select>
        {Object.values(searchParams).some(Boolean) && (
          <button className="btn btn-ghost btn-sm" onClick={() => router.push("/profiles")}>
            ✕ Clear
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Group</th>
              <th>Country</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {initialData.data.length === 0 ? (
              <tr className="loading-row"><td colSpan={6}>No profiles found</td></tr>
            ) : initialData.data.map((p) => (
              <tr key={p.id}>
                <td>
                  <a href={`/profiles/${p.id}`} style={{ color: "var(--text-accent)" }}>
                    {p.name}
                  </a>
                </td>
                <td><span className={`gender-badge ${p.gender}`}>{p.gender}</span></td>
                <td>{p.age}</td>
                <td><span className={`age-badge ${p.age_group}`}>{p.age_group}</span></td>
                <td>{p.country_name} <span style={{ color: "var(--text-muted)", fontSize: 11 }}>({p.country_id})</span></td>
                <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span className="pagination-info">
            Page {initialData.page} of {initialData.total_pages} · {initialData.total} results
          </span>
          <div className="pagination-controls">
            <button className="page-btn" disabled={initialData.page <= 1} onClick={() => setPage(initialData.page - 1)}>← Prev</button>
            {Array.from({ length: Math.min(5, initialData.total_pages) }, (_, i) => {
              const pg = Math.max(1, initialData.page - 2) + i;
              if (pg > initialData.total_pages) return null;
              return (
                <button key={pg} className={`page-btn ${pg === initialData.page ? "active" : ""}`} onClick={() => setPage(pg)}>{pg}</button>
              );
            })}
            <button className="page-btn" disabled={initialData.page >= initialData.total_pages} onClick={() => setPage(initialData.page + 1)}>Next →</button>
          </div>
        </div>
      </div>
    </>
  );
}
