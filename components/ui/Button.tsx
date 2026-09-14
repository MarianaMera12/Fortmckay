"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "blue" | "gold" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-black",
  blue: "bg-blue text-white hover:brightness-95",
  gold: "bg-gold text-white hover:brightness-95",
  ghost: "border border-black/10 bg-white text-ink hover:bg-black/5",
  danger: "bg-danger text-white hover:brightness-95",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/** Large, obvious action button — min 44px tall for touch targets. */
export function Button({ variant = "primary", className = "", ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`min-h-[44px] rounded-xl px-5 text-[15px] transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    />
  );
}
