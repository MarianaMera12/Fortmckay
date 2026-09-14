import type { Member } from "./types";

export const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** YYYY-MM-DD in local time (never use toISOString — it shifts the day). */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Monday of the week containing `d`. */
export function startOfWeek(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** "18:30:00" -> "6:30 PM" */
export function formatTime(value: string): string {
  const [hRaw, m] = value.split(":");
  let h = Number(hRaw);
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${suffix}`;
}

/** ISO timestamp -> "6:30 PM" */
export function formatTimestamp(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  let h = d.getHours();
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${pad(d.getMinutes())} ${suffix}`;
}

export function weekLabel(start: Date): string {
  const end = addDays(start, 6);
  return `${MONTHS[start.getMonth()]} ${start.getDate()} – ${MONTHS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
}

export function fullName(m: Pick<Member, "first_name" | "last_name">): string {
  return `${m.first_name} ${m.last_name}`.trim();
}

export function initials(m: Pick<Member, "first_name" | "last_name">): string {
  return `${m.first_name[0] ?? ""}${m.last_name[0] ?? ""}`.toUpperCase();
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
