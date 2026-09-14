"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { createClass, updateClass } from "@/lib/queries/classes";
import type { ClassInput, ClassWithCount } from "@/lib/types";

interface Props {
  open: boolean;
  gymClass: ClassWithCount | null;
  defaultDate: string;
  onClose: () => void;
  onSaved: () => void;
}

export function ClassFormModal({
  open,
  gymClass,
  defaultDate,
  onClose,
  onSaved,
}: Props) {
  const empty: ClassInput = {
    name: "",
    instructor: "",
    date: defaultDate,
    start_time: "06:00",
    end_time: "07:00",
    capacity: 15,
  };
  const [form, setForm] = useState<ClassInput>(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setError("");
    setForm(
      gymClass
        ? {
            name: gymClass.name,
            instructor: gymClass.instructor,
            date: gymClass.date,
            start_time: gymClass.start_time.slice(0, 5),
            end_time: gymClass.end_time.slice(0, 5),
            capacity: gymClass.capacity,
          }
        : { ...empty, date: defaultDate }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gymClass, open, defaultDate]);

  async function save() {
    if (!form.name || !form.instructor || !form.date) {
      setError("Class name, instructor and date are required.");
      return;
    }
    if (form.end_time <= form.start_time) {
      setError("End time must be after the start time.");
      return;
    }
    setBusy(true);
    try {
      if (gymClass) await updateClass(gymClass.id, form);
      else await createClass(form);
      onSaved();
    } catch {
      setError("Could not save the class. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      title={gymClass ? "Edit class" : "Add a class"}
      subtitle="Set the time and capacity for this session."
      onClose={onClose}
    >
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field
          label="Class name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
        />
        <Field
          label="Instructor"
          value={form.instructor}
          onChange={(v) => setForm((f) => ({ ...f, instructor: v }))}
        />
        <Field
          label="Date"
          type="date"
          value={form.date}
          onChange={(v) => setForm((f) => ({ ...f, date: v }))}
        />
        <Field
          label="Max capacity"
          type="number"
          value={String(form.capacity)}
          onChange={(v) => setForm((f) => ({ ...f, capacity: Number(v) || 0 }))}
        />
        <Field
          label="Start time"
          type="time"
          value={form.start_time}
          onChange={(v) => setForm((f) => ({ ...f, start_time: v }))}
        />
        <Field
          label="End time"
          type="time"
          value={form.end_time}
          onChange={(v) => setForm((f) => ({ ...f, end_time: v }))}
        />
      </div>

      {error && <p className="mt-3.5 text-[13.5px] text-danger">{error}</p>}

      <div className="mt-6 flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" disabled={busy} onClick={() => void save()}>
          {busy ? "Saving…" : "Save class"}
        </Button>
      </div>
    </Modal>
  );
}
