"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { checkIn, checkOut, getOpenSessions } from "@/lib/queries/attendance";
import { searchMembers } from "@/lib/queries/members";
import type { Member } from "@/lib/types";
import { fullName, initials } from "@/lib/utils";

export function QuickCheckIn({ onChanged }: { onChanged?: () => void }) {
  const [term, setTerm] = useState("");
  const debounced = useDebounce(term);
  const [results, setResults] = useState<Member[]>([]);
  const [open, setOpen] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!debounced.trim()) {
      setResults([]);
      setError("");
      return;
    }
    setError("");
    searchMembers(debounced)
      .then(async (rows) => {
        if (!active) return;
        setResults(rows);
        setOpen(await getOpenSessions(rows.map((r) => r.id)));
      })
      .catch(() => {
        if (active) setError("Could not search members. Please try again.");
      });
    return () => {
      active = false;
    };
  }, [debounced]);

  async function toggle(member: Member) {
    setBusyId(member.id);
    setError("");
    try {
      const session = open[member.id];
      if (session) await checkOut(session);
      else await checkIn(member.id);
      setOpen(await getOpenSessions(results.map((r) => r.id)));
      onChanged?.();
    } catch {
      setError("Could not update attendance. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <SearchInput
        value={term}
        onChange={setTerm}
        placeholder="Search name, member ID or phone…"
      />
      {error && <p className="mt-3 text-[13.5px] text-danger">{error}</p>}

      <ul className="mt-3 divide-y divide-black/5">
        {results.map((m) => {
          const inside = Boolean(open[m.id]);
          return (
            <li key={m.id} className="flex items-center gap-3 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-xs text-black/50">
                {initials(m)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14.5px]">{fullName(m)}</span>
                <span className="block text-[12.5px] text-black/40">
                  {m.member_id ?? m.phone}
                </span>
              </span>
              <Button
                variant={inside ? "primary" : "blue"}
                disabled={busyId === m.id}
                onClick={() => void toggle(m)}
              >
                {inside ? "Check-out" : "Check-in"}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
