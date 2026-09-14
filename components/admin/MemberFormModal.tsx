"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, SelectField } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { createMember, updateMember } from "@/lib/queries/members";
import type { Member, MemberInput, MembershipStatus } from "@/lib/types";

const EMPTY: MemberInput = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  membership_status: "active",
  member_id: "",
};

interface Props {
  open: boolean;
  member: Member | null;
  onClose: () => void;
  onSaved: () => void;
}

export function MemberFormModal({ open, member, onClose, onSaved }: Props) {
  const [form, setForm] = useState<MemberInput>(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setError("");
    setForm(
      member
        ? {
            first_name: member.first_name,
            last_name: member.last_name,
            phone: member.phone,
            email: member.email ?? "",
            membership_status: member.membership_status,
            member_id: member.member_id ?? "",
          }
        : EMPTY
    );
  }, [member, open]);

  const set = <K extends keyof MemberInput>(key: K) => (value: MemberInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function save() {
    if (!form.first_name || !form.last_name || !form.phone) {
      setError("First name, last name and phone are required.");
      return;
    }
    setBusy(true);
    try {
      if (member) await updateMember(member.id, form);
      else await createMember(form);
      onSaved();
    } catch {
      setError("Could not save the member. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      title={member ? "Edit member" : "Add new member"}
      subtitle="Only name and phone are required."
      onClose={onClose}
    >
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="First name" value={form.first_name} onChange={set("first_name")} />
        <Field label="Last name" value={form.last_name} onChange={set("last_name")} />
        <Field label="Phone" type="tel" value={form.phone} onChange={set("phone")} />
        <Field label="Email" type="email" value={form.email} onChange={set("email")} />
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
        <Field
          label="Member ID (optional)"
          value={form.member_id}
          onChange={set("member_id")}
          placeholder="auto"
        />
      </div>

      {error && <p className="mt-3.5 text-[13.5px] text-danger">{error}</p>}

      <div className="mt-6 flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" disabled={busy} onClick={() => void save()}>
          {busy ? "Saving…" : "Save member"}
        </Button>
      </div>
    </Modal>
  );
}
