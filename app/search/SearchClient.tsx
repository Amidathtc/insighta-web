"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const EXAMPLES = [
  "young males from nigeria",
  "senior women in kenya",
  "adults from ghana",
  "teenagers below 18",
  "females over 50",
];

export default function SearchClient({ results, initialQuery }: { results: any; initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  function setPage(p: number) {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${p}`);
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="search-bar" style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. young males from nigeria…"
            autoFocus
          />
          <button type="submit">Search</button>
        </div>
      </form>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 12, border: "1px solid var(--border)" }}
            onClick={() => {
              setQuery(ex);
              router.push(`/search?q=${encodeURIComponent(ex)}`);
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      {initialQuery && (
        <div className="table-wrapper">
          <div className="table-header">
            <div>
              <div className="table-title">Results for &quot;{initialQuery}&quot;</div>
              <div className="table-count">{results.total} matches found</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Gender</th><th>Age</th><th>Group</th><th>Country</th>
              </tr>
            </thead>
            <tbody>
              {results.data.length === 0 ? (
                <tr className="loading-row"><td colSpan={5}>No results found for this query</td></tr>
              ) : results.data.map((p: any) => (
                <tr key={p.id}>
                  <td><a href={`/profiles/${p.id}`} style={{ color: "var(--text-accent)" }}>{p.name}</a></td>
                  <td><span className={`gender-badge ${p.gender}`}>{p.gender}</span></td>
                  <td>{p.age}</td>
                  <td><span className={`age-badge ${p.age_group}`}>{p.age_group}</span></td>
                  <td>{p.country_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.total_pages > 1 && (
            <div className="pagination">
              <span className="pagination-info">Page {results.page} of {results.total_pages}</span>
              <div className="pagination-controls">
                <button className="page-btn" disabled={results.page <= 1} onClick={() => setPage(results.page - 1)}>← Prev</button>
                <button className="page-btn" disabled={results.page >= results.total_pages} onClick={() => setPage(results.page + 1)}>Next →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
