"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const supabase = createClient();
    const result =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setMessage(result.error.message);
      setIsLoading(false);
      return;
    }

    if (mode === "sign-up" && !result.data.session) {
      setMessage("Check your email to confirm your account, then sign in.");
      setIsLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-6 py-12 text-[#252525]">
      <section className="w-full max-w-md rounded-3xl border border-[#e5e3dd] bg-white p-8 shadow-[0_12px_40px_rgba(36,35,31,0.06)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b897f]">Notes</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {mode === "sign-in" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#77746b]">
          {mode === "sign-in"
            ? "Sign in to access your notes from any device."
            : "Create an account so your notes can sync between devices."}
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium" htmlFor="email">
            Email
            <input
              className="mt-2 w-full rounded-xl border border-[#dedcd5] px-4 py-3 outline-none transition focus:border-[#252525]"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block text-sm font-medium" htmlFor="password">
            Password
            <input
              className="mt-2 w-full rounded-xl border border-[#dedcd5] px-4 py-3 outline-none transition focus:border-[#252525]"
              id="password"
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {message ? <p className="text-sm text-[#9a4d3e]">{message}</p> : null}

          <button
            className="w-full rounded-full bg-[#252525] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#454545] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          className="mt-6 w-full text-sm text-[#77746b] underline-offset-4 hover:text-[#252525] hover:underline"
          onClick={() => {
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            setMessage("");
          }}
          type="button"
        >
          {mode === "sign-in" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
}
