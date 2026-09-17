"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { getConsentByMemberId } from "@/lib/queries/consents";
import { WAIVER_SECTIONS, WAIVER_TITLE } from "@/lib/waiver";
import type { Consent, Member } from "@/lib/types";

interface Props {
  open: boolean;
  member: Member | null;
  onClose: () => void;
}

export function ViewConsentModal({ open, member, onClose }: Props) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !member) return;
    setLoading(true);
    setError("");
    setConsent(null);
    getConsentByMemberId(member.id)
      .then(setConsent)
      .catch(() => setError("Could not load the consent record."))
      .finally(() => setLoading(false));
  }, [open, member]);

  return (
    <Modal open={open} title="Waiver consent" onClose={onClose} size="lg">
      {loading && <p className="text-[13.5px] text-black/50">Loading…</p>}
      {error && <p className="text-[13.5px] text-danger">{error}</p>}

      {!loading && !error && !consent && (
        <p className="text-[13.5px] text-black/50">
          No signed waiver on file for this member yet.
        </p>
      )}

      {consent && (
        <>
          <div className="mb-4 rounded-xl bg-cream p-4 text-[13.5px]">
            <p className="font-medium">{consent.full_name}</p>
            <p className="text-black/55">
              {consent.email || "—"} · {consent.phone}
              {consent.date_of_birth ? ` · DOB ${consent.date_of_birth}` : ""}
            </p>
            {consent.address && <p className="text-black/55">{consent.address}</p>}
            {consent.medical_info && (
              <p className="mt-1 text-black/55">Medical info: {consent.medical_info}</p>
            )}
            <p className="mt-2 text-black/40">
              Accepted {new Date(consent.accepted_at).toLocaleString()} · waiver{" "}
              {consent.waiver_version}
            </p>
          </div>

          <div className="max-h-[38vh] overflow-y-auto rounded-xl border border-black/10 p-4 text-[13.5px] leading-relaxed">
            <p className="mb-3 font-medium">{WAIVER_TITLE}</p>
            {WAIVER_SECTIONS.map((section) => (
              <div key={section.heading} className="mb-3.5">
                <p className="mb-1 font-medium">{section.heading}</p>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="mb-1.5 text-black/70">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="list-disc space-y-1 pl-4 text-black/70">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <a
              className="flex-1"
              href={`/api/consents/${consent.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="blue" className="w-full">
                Download PDF
              </Button>
            </a>
          </div>
        </>
      )}
    </Modal>
  );
}
