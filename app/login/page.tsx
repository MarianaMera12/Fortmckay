"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-[18px] bg-white p-8 shadow-xl"
      >
        <p className="font-display text-[19px] tracking-[2.5px]">FORT McKAY</p>
        <p className="mb-6 font-display text-[9.5px] tracking-[3px] text-black/40">
          FIRST NATION · FITNESS CENTRE
        </p>
        <h1 className="mb-5 text-xl font-medium">Staff sign in</h1>

        <div className="flex flex-col gap-3.5">
          <Field label="Email" type="email" value={email} onChange={setEmail} />
          <Field label="Password" type="text" value={password} onChange={setPassword} />
        </div>

        {error && <p className="mt-3 text-[13.5px] text-danger">{error}</p>}

        <Button type="submit" disabled={busy} className="mt-6 w-full">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
