"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { QuickCheckIn } from "@/components/admin/QuickCheckIn";
import { Card, CardTitle } from "@/components/ui/Card";
import { StatusChip } from "@/components/ui/StatusChip";
import { listRecentActivity } from "@/lib/queries/attendance";
import type { AttendanceWithMember } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

export default function CheckInPage() {
  const [rows, setRows] = useState<AttendanceWithMember[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setError("");
    listRecentActivity(15)
      .then(setRows)
      .catch(() => {
        setRows([]);
        setError("Could not load check-in activity. Please try again.");
      });
  }, []);

  useEffect(load, [load]);

  return (
    <>
      <PageHeader title="Check-ins" subtitle="Here is today's check-in overview." />

      <div className="flex flex-col gap-5 px-8 py-6">
        <Card>
          <CardTitle>Find a member</CardTitle>
          <QuickCheckIn onChanged={load} />
        </Card>

        <Card>
          <CardTitle>Recent check activity</CardTitle>
          {error && <p className="mb-4 text-[13.5px] text-danger">{error}</p>}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5 text-[13px] tracking-widest text-black/45">
                <th className="pb-2.5 font-normal">MEMBER</th>
                <th className="pb-2.5 font-normal">CHECK-IN</th>
                <th className="pb-2.5 font-normal">CHECK-OUT</th>
                <th className="pb-2.5 text-right font-normal">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-black/5">
                  <td className="py-3 text-[14.5px]">
                    {r.members ? `${r.members.first_name} ${r.members.last_name}` : "Member"}
                    <span className="block text-[12.5px] text-black/40">
                      {r.members?.phone}
                    </span>
                  </td>
                  <td className="py-3 text-sm">{formatTimestamp(r.check_in)}</td>
                  <td className="py-3 text-sm">{formatTimestamp(r.check_out)}</td>
                  <td className="py-3 text-right">
                    <StatusChip inside={!r.check_out} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="py-8 text-center text-sm text-black/40">No activity recorded.</p>
          )}
        </Card>
      </div>
    </>
  );
}
