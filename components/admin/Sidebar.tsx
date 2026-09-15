"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/members", label: "Members", icon: "◍" },
  { href: "/admin/checkin", label: "Check-in", icon: "⇥" },
  { href: "/admin/calendar", label: "Calendar", icon: "▤" },
] as const;

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="flex w-[230px] shrink-0 flex-col bg-sidebar py-6 text-white sticky top-0 h-screen">
      <div className="mb-6 flex items-center gap-3 border-b border-white/10 px-5 pb-5">
        <span className="flex  items-center justify-center">
          <img src="/logo.png" alt="Logo" className="object-contain" />
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[44px] items-center gap-3.5 rounded-lg px-3.5 text-[15px] ${active ? "bg-blue text-ink" : "text-white/75 hover:bg-white/5"}`}
            >
              <span className="w-5 text-center" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4">
        <Link
          href="/"
          className="mb-5 block rounded-lg border border-white/15 py-2.5 text-center text-[13.5px] text-white/70"
        >
          View public portal ↗
        </Link>
        <div className="flex items-center gap-3 border-t border-white/10 pt-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue text-xs text-ink">
            {email.slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm">{email}</span>
            <button onClick={signOut} className="text-xs text-white/45 hover:text-white">
              Sign out
            </button>
          </span>
        </div>
      </div>
    </aside>
  );
}
