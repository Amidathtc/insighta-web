import { redirect } from "next/navigation";
import { getServerUser, serverFetch } from "@/lib/api";
import Sidebar from "@/app/components/Sidebar";
import ProfilesClient from "./ProfilesClient";

interface SearchParams {
  [key: string]: string | undefined;
  page?: string;
  gender?: string;
  age_group?: string;
  country_id?: string;
  sort_by?: string;
  order?: string;
}

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getServerUser();
  if (!user) redirect("/");

  const page = searchParams.page || "1";
  const params = new URLSearchParams({ page, limit: "15" });
  if (searchParams.gender) params.set("gender", searchParams.gender);
  if (searchParams.age_group) params.set("age_group", searchParams.age_group);
  if (searchParams.country_id) params.set("country_id", searchParams.country_id);
  if (searchParams.sort_by) params.set("sort_by", searchParams.sort_by);
  if (searchParams.order) params.set("order", searchParams.order);

  let profilesData = { data: [], page: 1, total: 0, total_pages: 1, links: {} };
  try {
    const res = await serverFetch(`/api/profiles?${params.toString()}`);
    if (res.ok) profilesData = await res.json();
  } catch {}

  return (
    <div className="page-wrapper">
      <Sidebar user={user} />
      <main className="main-content">
        <ProfilesClient
          initialData={profilesData}
          searchParams={searchParams}
          userRole={user.role}
        />
      </main>
    </div>
  );
}
