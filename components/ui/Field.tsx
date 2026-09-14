"use client";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "date" | "time" | "number";
}

export function Field({ label, value, onChange, placeholder, type = "text" }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-[13.5px] text-black/55">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[44px] rounded-xl border border-black/10 bg-cream px-3 text-[15px] text-ink outline-none focus:border-blue"
      />
    </label>
  );
}

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectProps<T>) {
  return (
    <label className="flex flex-col gap-1.5 text-[13.5px] text-black/55">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="min-h-[44px] rounded-xl border border-black/10 bg-cream px-3 text-[15px] text-ink outline-none focus:border-blue"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
