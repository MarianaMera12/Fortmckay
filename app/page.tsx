import Link from "next/link";
import { PublicSchedule } from "@/components/community/PublicSchedule";

export default function PublicPortalPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="flex flex-wrap items-center gap-4 bg-sidebar px-6 py-5 text-white sm:px-8">
        <span className="flex  items-center justify-center">
          <img src="/logo.png" alt="Logo" className="object-contain w-48 h-13" />
        </span>
        <span className="flex-1 font-display leading-tight">
        </span>
        <Link
          href="/login"
          className="rounded-lg border border-white/15 px-4 py-2.5 text-[13.5px] text-white/75"
        >
          Staff login
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-9 sm:px-6">
        <h1 className="text-[30px] font-medium">Weekly class schedule</h1>
        <p className="mt-2 max-w-xl text-base text-black/50">
          Reserve a spot in any class — no account needed. Just your name, phone and email.
        </p>
        <PublicSchedule />
      </main>
    </div>
  );
}
