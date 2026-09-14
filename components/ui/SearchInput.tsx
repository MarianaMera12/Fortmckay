"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accent?: "blue" | "gold";
}

export function SearchInput({ value, onChange, placeholder, accent = "blue" }: Props) {
  return (
    <div className="flex min-h-[48px] flex-1 overflow-hidden rounded-xl">
      <span
        className={`flex items-center px-5 text-white ${accent === "blue" ? "bg-blue" : "bg-gold"}`}
        aria-hidden
      >
        ⌕
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-sidebar px-4 text-[15px] text-white outline-none placeholder:text-white/40"
      />
    </div>
  );
}
