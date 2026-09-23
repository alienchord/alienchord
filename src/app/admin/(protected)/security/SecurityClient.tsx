"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function SecurityPage() {
const { data: session } = useSession();

const [showPassword, setShowPassword] = useState(false);
const [logoutLoading, setLogoutLoading] = useState(false);
const [logoutAllLoading, setLogoutAllLoading] = useState(false);

const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [message, setMessage] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleChangePassword(
event: React.FormEvent<HTMLFormElement>
) {
event.preventDefault();

setMessage("");
setError("");

if (newPassword.length < 8) {
  setError("New password must contain at least 8 characters.");
  return;
}

if (newPassword !== confirmPassword) {
  setError("New passwords do not match.");
  return;
}

setLoading(true);

try {
  const response = await fetch("/api/admin/auth/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data?.success) {
    setError(
      data?.error || "Failed to change password."
    );
    return;
  }

  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");

  setMessage("Password changed successfully.");
} catch {
  setError("Something went wrong. Please try again.");
} finally {
  setLoading(false);
}

}

async function handleLogout() {
setLogoutLoading(true);
setError("");
setMessage("");

try {
  await signOut({
    callbackUrl: "/admin/login",
  });
} catch {
  setError("Failed to log out.");
  setLogoutLoading(false);
}

}

async function handleLogoutAllSessions() {
setLogoutAllLoading(true);
setError("");
setMessage("");

try {
  const response = await fetch(
    "/api/admin/auth/logout-all",
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok || !data?.success) {
    setError(
      data?.error ||
        "Failed to log out all sessions."
    );
    return;
  }

  window.location.href = "/admin/login";
} catch {
  setError(
    "Something went wrong. Please try again."
  );
} finally {
  setLogoutAllLoading(false);
}

}

return (
<main className="min-h-screen bg-[#030308] px-4 py-8 text-white md:px-8 md:py-12">
<div className="mx-auto max-w-5xl space-y-8">
<header className="border-b border-white/10 pb-6">
<p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-cyan-300">
Alien Chord
</p>

      <h1 className="font-[var(--font-syne)] text-4xl uppercase tracking-[-0.03em] md:text-6xl">
        Security
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
        Manage administrator access and security settings.
      </p>
    </header>

    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          Admin access
        </span>

        <div className="mt-5 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,245,255,0.8)]" />

          <span className="text-sm text-cyan-300">
            Active
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          Two-factor authentication
        </span>

        <div className="mt-5 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-white/20" />

          <span className="text-sm text-white/40">
            Not configured
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          Session
        </span>

        <div className="mt-5 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,245,255,0.8)]" />

          <span className="text-sm text-cyan-300">
            Current session
          </span>
        </div>
      </div>
    </section>

    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Google Account
        </h2>

        <p className="mt-2 text-xs text-white/30">
          Google account used to access the Alien Chord control panel.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/30">
          Email
        </label>

        <input
          type="text"
          value={session?.user?.email ?? ""}
          readOnly
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60 outline-none"
        />
      </div>
    </section>

    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Change Password
        </h2>

        <p className="mt-2 max-w-2xl text-xs leading-5 text-white/30">
          Change the administrator password. The new password must contain at least 8 characters.
        </p>
      </div>

      <form
        onSubmit={handleChangePassword}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/30">
            Current password
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/30">
            New password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            autoComplete="new-password"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/30">
            Confirm new password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            autoComplete="new-password"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-xs text-red-300/80">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-3 text-xs text-cyan-300/80">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full border border-cyan-400/40 bg-cyan-400/[0.06] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-cyan-300 transition hover:border-cyan-300/70 hover:bg-cyan-300/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </section>

    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Two-Factor Authentication
        </h2>

        <p className="mt-2 max-w-2xl text-xs leading-5 text-white/30">
          Add an additional verification step when signing into the administrator account.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-white/70">
            Phone verification
          </p>

          <p className="mt-1 text-xs text-white/30">
            SMS verification will be configured later.
          </p>
        </div>

        <span className="rounded-full border border-white/10 px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-white/30">
          Not configured
        </span>
      </div>
    </section>

    <section className="rounded-2xl border border-red-400/10 bg-red-400/[0.02] p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-red-300/70">
          Danger Zone
        </h2>

        <p className="mt-2 text-xs text-white/30">
          Actions affecting administrator access.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading || logoutAllLoading}
          className="rounded-full border border-red-400/20 px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-red-300/70 transition hover:border-red-400/40 hover:bg-red-400/[0.05] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {logoutLoading
            ? "Logging out..."
            : "Log Out"}
        </button>

        <button
          type="button"
          onClick={handleLogoutAllSessions}
          disabled={logoutLoading || logoutAllLoading}
          className="rounded-full border border-red-400/20 px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-red-300/70 transition hover:border-red-400/40 hover:bg-red-400/[0.05] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {logoutAllLoading
            ? "Logging out..."
            : "Log Out All Sessions"}
        </button>
      </div>
    </section>
  </div>
</main>

);
}