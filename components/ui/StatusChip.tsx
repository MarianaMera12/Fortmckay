export function StatusChip({ inside }: { inside: boolean }) {
  return (
    <span
      className={`rounded-md px-3 py-1.5 text-[11.5px] tracking-widest text-white ${inside ? "bg-gold" : "bg-blue"}`}
    >
      {inside ? "INSIDE" : "LEFT"}
    </span>
  );
}

export function MembershipChip({ status }: { status: string }) {
  const color =
    status === "active" ? "text-ok" : status === "paused" ? "text-gold" : "text-danger";
  return <span className={`text-xs capitalize ${color}`}>{status}</span>;
}
