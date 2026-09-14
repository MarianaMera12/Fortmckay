import Link from "next/link";
import { PublicSchedule } from "@/components/public/PublicSchedule";

export default function PublicPortalPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="flex flex-wrap items-center gap-4 bg-sidebar px-6 py-5 text-white sm:px-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 font-display text-[15px] text-[#e6dcc8]">
          FM
        </span>
        <span className="flex-1 font-display leading-tight">
          <span className="block text-[19px] tracking-[2.5px]">FORT McKAY</span>
          <span className="block text-[9.5px] tracking-[3px] text-white/50">
            FIRST NATION · FITNESS CENTRE
          </span>
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
