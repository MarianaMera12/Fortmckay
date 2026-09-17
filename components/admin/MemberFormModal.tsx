"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, SelectField, TextareaField } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { createMember, updateMember } from "@/lib/queries/members";
import { createConsent } from "@/lib/queries/consents";
import { WAIVER_SECTIONS, WAIVER_TITLE } from "@/lib/waiver";
import type { Member, MemberInput, MembershipStatus } from "@/lib/types";
import { fullName } from "@/lib/utils";

const EMPTY: MemberInput = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  membership_status: "active",
  member_id: "",
  date_of_birth: "",
  address: "",
  medical_info: "",
};

interface Props {
  open: boolean;
  member: Member | null;
  onClose: () => void;
  onSaved: () => void;
}

export function MemberFormModal({ open, member, onClose, onSaved }: Props) {
  const [step, setStep] = useState<"form" | "waiver">("form");
  const [form, setForm] = useState<MemberInput>(EMPTY);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setError("");
    setNotice("");
    setStep("form");
    setForm(
      member
        ? {
            first_name: member.first_name,
            last_name: member.last_name,
            phone: member.phone,
            email: member.email ?? "",
            membership_status: member.membership_status,
            member_id: member.member_id ?? "",
            date_of_birth: member.date_of_birth ?? "",
            address: member.address ?? "",
            medical_info: member.medical_info ?? "",
          }
        : EMPTY
    );
  }, [member, open]);

  const set = <K extends keyof MemberInput>(key: K) => (value: MemberInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function continueToWaiver() {
    if (!form.first_name || !form.last_name || !form.phone) {
      setError("First name, last name and phone are required.");
      return;
    }
    setError("");
    setNotice("");
    setStep("waiver");
  }

  async function saveExisting() {
    if (!form.first_name || !form.last_name || !form.phone) {
      setError("First name, last name and phone are required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await updateMember(member!.id, form);
      onSaved();
    } catch {
      setError("Could not save the member. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function accept() {
    setBusy(true);
    setError("");
    try {
      const created = await createMember(form);
      await createConsent({
        member_id: created.id,
        full_name: fullName(created),
        email: form.email,
        phone: form.phone,
        date_of_birth: form.date_of_birth,
        address: form.address,
        medical_info: form.medical_info,
      });
      onSaved();
    } catch {
      setError("Could not save the member. Please try again.");
      setStep("form");
    } finally {
      setBusy(false);
    }
  }

  function decline() {
    setNotice("The member must accept the waiver before they can be registered.");
    setStep("form");
  }

  const isEdit = !!member;

  return (
    <Modal
      open={open}
      title={
        step === "waiver" ? "Waiver agreement" : isEdit ? "Edit member" : "Add new member"
      }
      subtitle={
        step === "waiver"
          ? "Please read this out loud to the new member, then have them press Accept or Decline themselves."
          : "Only name and phone are required."
      }
      onClose={onClose}
      size={step === "waiver" ? "lg" : "md"}
    >
      {step === "form" && (
        <>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field label="First name" value={form.first_name} onChange={set("first_name")} />
            <Field label="Last name" value={form.last_name} onChange={set("last_name")} />
            <Field label="Phone" type="tel" value={form.phone} onChange={set("phone")} />
            <Field label="Email" type="email" value={form.email} onChange={set("email")} />
            <Field
              label="Date of birth"
              type="date"
              value={form.date_of_birth}
              onChange={set("date_of_birth")}
            />
            <SelectField<MembershipStatus>
              label="Membership status"
              value={form.membership_status}
              onChange={set("membership_status")}
              options={[
                { value: "active", label: "Active" },
                { value: "paused", label: "Paused" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
            <Field label="Address" value={form.address} onChange={set("address")} />
            <Field
              label="Member ID (optional)"
              value={form.member_id}
              onChange={set("member_id")}
              placeholder="auto"
            />
          </div>

          <div className="mt-3.5">
            <TextareaField
              label="Medical information (allergies, conditions, etc.)"
              value={form.medical_info}
              onChange={set("medical_info")}
              placeholder="None"
            />
          </div>

          {notice && <p className="mt-3.5 text-[13.5px] text-black/55">{notice}</p>}
          {error && <p className="mt-3.5 text-[13.5px] text-danger">{error}</p>}

          <div className="mt-6 flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            {isEdit ? (
              <Button className="flex-1" disabled={busy} onClick={() => void saveExisting()}>
                {busy ? "Saving…" : "Save member"}
              </Button>
            ) : (
              <Button className="flex-1" onClick={continueToWaiver}>
                Continue to waiver
              </Button>
            )}
          </div>
        </>
      )}

      {step === "waiver" && (
        <>
          <div className="mb-4 rounded-xl bg-cream p-4 text-[13.5px]">
            <p className="font-medium">{fullName({ first_name: form.first_name, last_name: form.last_name })}</p>
            <p className="text-black/55">
              {form.email || "—"} · {form.phone}
              {form.date_of_birth ? ` · DOB ${form.date_of_birth}` : ""}
            </p>
            {form.address && <p className="text-black/55">{form.address}</p>}
            {form.medical_info && (
              <p className="mt-1 text-black/55">Medical info: {form.medical_info}</p>
            )}
          </div>

          <div className="max-h-[42vh] overflow-y-auto rounded-xl border border-black/10 p-4 text-[13.5px] leading-relaxed">
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

          {error && <p className="mt-3.5 text-[13.5px] text-danger">{error}</p>}

          <p className="mt-4 text-center text-[13px] text-black/45">
            Hand the device to the new member — they should press one of the buttons below.
          </p>
          <div className="mt-2 flex gap-3">
            <Button variant="danger" className="flex-1" disabled={busy} onClick={decline}>
              I decline
            </Button>
            <Button variant="blue" className="flex-1" disabled={busy} onClick={() => void accept()}>
              {busy ? "Saving…" : "I accept"}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
