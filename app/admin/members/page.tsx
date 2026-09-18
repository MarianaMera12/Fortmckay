"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { MemberFormModal } from "@/components/admin/MemberFormModal";
import { ViewConsentModal } from "@/components/admin/ViewConsentModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MembershipChip } from "@/components/ui/StatusChip";
import { SearchInput } from "@/components/ui/SearchInput";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  MEMBERS_PAGE_SIZE,
  deleteMember,
  listMembers,
} from "@/lib/queries/members";
import type { Member, MembershipStatus } from "@/lib/types";
import { fullName, initials } from "@/lib/utils";

type StatusFilter = "all" | MembershipStatus;

export default function MembersPage() {
  const [term, setTerm] = useState("");
  const debounced = useDebounce(term);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState<Member | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingConsent, setViewingConsent] = useState<Member | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setError("");
    listMembers({ search: debounced, status, page })
      .then(({ rows, total }) => {
        setRows(rows);
        setTotal(total);
      })
      .catch(() => {
        setRows([]);
        setError("Could not load members. Check your connection and try again.");
      });
  }, [debounced, status, page]);

  useEffect(load, [load]);
  useEffect(() => setPage(0), [debounced, status]);

  async function removeMember(m: Member) {
    if (!confirm(`Delete ${fullName(m)}? This cannot be undone.`)) return;
    try {
      await deleteMember(m.id);
      load();
    } catch {
      setError("Could not delete this member. Please try again.");
    }
  }

  const pages = Math.max(1, Math.ceil(total / MEMBERS_PAGE_SIZE));

  return (
    <>
      <PageHeader title="Members" subtitle="Here is the whole community overview." />

      <div className="flex flex-col gap-5 px-8 py-6">
        <Card className="flex flex-wrap items-center gap-3.5">
          <SearchInput
            value={term}
            onChange={setTerm}
            placeholder="Search by member name, ID or phone number…"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="min-h-[48px] rounded-xl border border-black/10 bg-cream px-3 text-[15px]"
          >
            <option value="all">All memberships</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button
            variant="blue"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            ＋ Add member
          </Button>
        </Card>

        <Card>
          {error && <p className="mb-4 text-[13.5px] text-danger">{error}</p>}
          <table className="w-full text-left">
            <thead>
              <tr className="text-[14.5px] text-black/45">
                <th className="pb-2.5 font-normal">Name</th>
                <th className="pb-2.5 font-normal">Member ID</th>
                <th className="pb-2.5 font-normal">Contact</th>
                <th className="pb-2.5 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id} className="border-t border-black/5">
                  <td className="py-3">
                    <span className="flex items-center gap-3.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-xs text-black/50">
                        {initials(m)}
                      </span>
                      <span>
                        <span className="block text-[15px]">{fullName(m)}</span>
                        <MembershipChip status={m.membership_status} />
                      </span>
                    </span>
                  </td>
                  <td className="py-3 text-sm">{m.member_id ?? "—"}</td>
                  <td className="py-3 text-[13.5px]">
                    {m.phone}
                    <span className="block text-black/40">{m.email ?? "—"}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex gap-4">
                      <button onClick={() => setViewingConsent(m)} title="View consent">
                        📄
                      </button>
                      <button
                        onClick={() => {
                          setEditing(m);
                          setModalOpen(true);
                        }}
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => void removeMember(m)}
                        title="Delete member"
                        className="text-danger"
                      >
                        ✕
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="py-10 text-center text-[14.5px] text-black/40">
              No members match that search.
            </p>
          )}

          {pages > 1 && (
            <div className="mt-4 flex items-center justify-end gap-3 text-sm">
              <Button
                variant="ghost"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹
              </Button>
              <span className="text-black/50">
                Page {page + 1} of {pages}
              </span>
              <Button
                variant="ghost"
                disabled={page + 1 >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </Button>
            </div>
          )}
        </Card>
      </div>

      <MemberFormModal
        open={modalOpen}
        member={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          load();
        }}
      />

      <ViewConsentModal
        open={!!viewingConsent}
        member={viewingConsent}
        onClose={() => setViewingConsent(null)}
      />
    </>
  );
}
