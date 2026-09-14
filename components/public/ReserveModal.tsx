"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { ClassFullError, reserveClass } from "@/lib/queries/reservations";
import type { ClassWithCount, ReservationInput } from "@/lib/types";
import { formatTime, isValidEmail } from "@/lib/utils";

const EMPTY: ReservationInput = { name: "", phone: "", email: "" };

export function ReserveModal({
  gymClass,
  onClose,
  onReserved,
}: {
  gymClass: ClassWithCount | null;
  onClose: () => void;
  onReserved: () => void;
}) {
  const [form, setForm] = useState<ReservationInput>(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setForm(EMPTY);
    setError("");
    setDone(false);
  }, [gymClass]);

  if (!gymClass) return null;

  async function submit() {
    if (!form.name || !form.phone || !form.email) {
      setError("Please fill in your name, phone and email.");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("That email address doesn't look right.");
      return;
    }
    setBusy(true);
    try {
      await reserveClass(gymClass!.id, form);
      setDone(true);
    } catch (e) {
      setError(
        e instanceof ClassFullError
          ? "Sorry, this class just reached maximum capacity."
          : "Could not save your reservation. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <Modal open title="You're booked" onClose={onReserved}>
        <div className="flex flex-col items-center gap-3.5 py-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl text-white">
            ✓
          </span>
          <p className="max-w-xs text-[15.5px] text-black/70">
            {gymClass.name} — {gymClass.date} at {formatTime(gymClass.start_time)}. A
            confirmation was sent to {form.email}.
          </p>
          <Button className="mt-2" onClick={onReserved}>
            Done
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      title="Reserve your spot"
      subtitle={`${gymClass.name} · ${formatTime(gymClass.start_time)} · ${gymClass.instructor}`}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3.5">
        <Field
          label="Full name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
        />
        <Field
          label="Phone number"
          type="tel"
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
        />
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        />
      </div>

      {error && <p className="mt-3.5 text-[13.5px] text-danger">{error}</p>}

      <div className="mt-6 flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" disabled={busy} onClick={() => void submit()}>
          {busy ? "Reserving…" : "Confirm reservation"}
        </Button>
      </div>
    </Modal>
  );
}
