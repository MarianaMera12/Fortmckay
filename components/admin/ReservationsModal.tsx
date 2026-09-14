"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { listReservations } from "@/lib/queries/classes";
import type { ClassWithCount, Reservation } from "@/lib/types";
import { formatTime } from "@/lib/utils";

export function ReservationsModal({
  gymClass,
  onClose,
}: {
  gymClass: ClassWithCount | null;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<Reservation[]>([]);

  useEffect(() => {
    if (!gymClass) return;
    listReservations(gymClass.id).then(setRows).catch(() => setRows([]));
  }, [gymClass]);

  if (!gymClass) return null;

  return (
    <Modal
      open
      title={gymClass.name}
      subtitle={`${gymClass.date} · ${formatTime(gymClass.start_time)} – ${formatTime(
        gymClass.end_time
      )} · ${gymClass.instructor}`}
      onClose={onClose}
    >
      <p className="mb-3 text-sm text-black/50">
        {rows.length} of {gymClass.capacity} spots reserved
      </p>
      <ul className="divide-y divide-black/5">
        {rows.map((r) => (
          <li key={r.id} className="py-2.5 text-[14.5px]">
            {r.name}
            <span className="block text-[12.5px] text-black/45">
              {r.phone} · {r.email}
            </span>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="py-6 text-center text-sm text-black/40">No reservations yet.</li>
        )}
      </ul>
    </Modal>
  );
}
