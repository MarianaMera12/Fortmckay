"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cancelReservation, listReservations } from "@/lib/queries/classes";
import type { ClassWithCount, Reservation } from "@/lib/types";
import { formatTime } from "@/lib/utils";

export function ReservationsModal({
  gymClass,
  onClose,
  onChanged,
}: {
  gymClass: ClassWithCount | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!gymClass) return;
    let active = true;
    setRows([]);
    setError("");
    setLoading(true);
    listReservations(gymClass.id)
      .then((reservations) => {
        if (active) setRows(reservations);
      })
      .catch(() => {
        if (active) setError("Could not load reservations. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [gymClass?.id]);

  async function cancel(row: Reservation) {
    if (!confirm(`Cancel ${row.name}'s reservation?`)) return;
    setBusyId(row.id);
    setError("");
    try {
      await cancelReservation(row.id);
      setRows((current) => current.filter((reservation) => reservation.id !== row.id));
      onChanged();
    } catch {
      setError("Could not cancel this reservation. Please refresh and try again.");
    } finally {
      setBusyId(null);
    }
  }

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
      {error && <p role="alert" className="mb-3 text-sm text-danger">{error}</p>}
      <ul className="divide-y divide-black/5">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-3 py-2.5 text-[14.5px]">
            <span className="min-w-0">
              {r.name}
              <span className="block break-words text-[12.5px] text-black/45">
                {r.phone} · {r.email}
              </span>
            </span>
            <Button
              variant="danger"
              className="shrink-0 px-3 text-sm"
              disabled={busyId !== null}
              onClick={() => void cancel(r)}
            >
              {busyId === r.id ? "Cancelling…" : "Cancel"}
            </Button>
          </li>
        ))}
        {!loading && rows.length === 0 && !error && (
          <li className="py-6 text-center text-sm text-black/40">No reservations yet.</li>
        )}
        {loading && (
          <li className="py-6 text-center text-sm text-black/40">Loading reservations…</li>
        )}
      </ul>
    </Modal>
  );
}
