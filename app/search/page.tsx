import { redirect } from "next/navigation";
import { getServerUser, serverFetch } from "@/lib/api";
import Sidebar from "@/app/components/Sidebar";
import SearchClient from "./SearchClient";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const user = await getServerUser();
  if (!user) redirect("/");

  let results: any = { data: [], total: 0, page: 1, total_pages: 1 };
  const query = searchParams.q?.trim();

  if (query) {
    try {
      const params = new URLSearchParams({ q: query, page: searchParams.page || "1", limit: "10" });
      const res = await serverFetch(`/api/profiles/search?${params.toString()}`);
      if (res.ok) results = await res.json();
    } catch {}
  }

  return (
    <div className="page-wrapper">
      <Sidebar user={user} />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">Natural Language Search</h2>
            <p className="page-subtitle">Try: &quot;young males from nigeria&quot; or &quot;senior women in kenya&quot;</p>
          </div>
        </div>
        <SearchClient results={results} initialQuery={query || ""} />
      </main>
    </div>
  );
}
