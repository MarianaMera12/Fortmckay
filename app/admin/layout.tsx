import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar email={data.user.email ?? "staff"} />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
