"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  signIn,
  signOut,
  useSession,
} from "next-auth/react";

import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const { data: session, status } = useSession();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const googleSignedIn =
    !!session?.user?.email;

  const googleStarted = useRef(false);

  useEffect(() => {
    if (
      status !== "authenticated" ||
      googleStarted.current
    ) {
      return;
    }

    const shouldStartGoogle =
      new URLSearchParams(
        window.location.search
      ).get("google") === "1";

    if (!shouldStartGoogle) {
      return;
    }

    googleStarted.current = true;

    async function restartGoogleLogin() {
      await signOut({
        redirect: false,
      });

      await signIn("google", {
        callbackUrl: "/admin/login",
        prompt: "select_account",
      });
    }

    restartGoogleLogin();
  }, [status]);

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    await signIn("google", {
      callbackUrl: "/admin/login",
      prompt: "select_account",
    });
  }

  async function handlePasswordSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/auth/verify-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(
          data?.error || "Invalid password."
        );
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030308] text-white">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030308] px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-cyan-300/70">
            Alien Chord
          </p>

          <h1 className="font-[var(--font-syne)] text-4xl uppercase tracking-[-0.03em]">
            Admin Access
          </h1>

          <p className="mt-3 text-xs text-white/30">
            {googleSignedIn
              ? "Enter your Alien Chord password."
              : "Continue with Google to verify your identity."}
          </p>
        </div>

        {!googleSignedIn ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-8">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="
                w-full
                rounded-xl
                border
                border-white/15
                bg-white/[0.04]
                px-4
                py-3
                text-[11px]
                uppercase
                tracking-[0.2em]
                text-white/80
                transition
                hover:border-cyan-300/50
                hover:bg-cyan-300/[0.06]
                hover:text-cyan-300
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {loading
                ? "Connecting..."
                : "Continue with Google"}
            </button>

            {error && (
              <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-xs text-red-300/80">
                {error}
              </div>
            )}
          </div>
        ) : (
          <form
            onSubmit={handlePasswordSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Alien Chord Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  required
                  autoFocus
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-white/20
                    focus:border-cyan-400/50
                  "
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-xs text-red-300/80">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-cyan-400/40
                  bg-cyan-400/[0.08]
                  px-4
                  py-3
                  text-[11px]
                  uppercase
                  tracking-[0.2em]
                  text-cyan-300
                  transition
                  hover:border-cyan-300/70
                  hover:bg-cyan-300/[0.12]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {loading
                  ? "Checking..."
                  : "Enter Admin"}
              </button>

              <button
                type="button"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/admin/login",
                    prompt: "select_account",
                  })
                }
                className="
                  w-full
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  text-white/25
                  transition
                  hover:text-white/50
                "
              >
                Use another account
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-[9px] uppercase tracking-[0.25em] text-white/15">
          The future is human
        </p>
      </div>
    </main>
  );
}