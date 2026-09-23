"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
  googleVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

const roles: User["role"][] = [
  "OWNER",
  "ADMIN",
  "EDITOR",
  "VIEWER",
];

const newUserRoles: User["role"][] = [
  "ADMIN",
  "EDITOR",
  "VIEWER",
];

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] =
    useState<User["role"]>("EDITOR");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadUsers() {
    setError("");

    try {
      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(data?.error || "Failed to load users.");
        return;
      }

      setUsers(data.users);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  async function createUser(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setCreating(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/users/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(
          data?.error || "Failed to create user."
        );
        return;
      }

      setUsers((currentUsers) => [
        ...currentUsers,
        data.user,
      ]);

      setName("");
      setEmail("");
      setRole("EDITOR");

      setMessage("User created successfully.");
    } catch {
      setError("Failed to create user.");
    } finally {
      setCreating(false);
    }
  }

  async function changeRole(
    userId: string,
    role: User["role"]
  ) {
    setSavingId(userId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/users/${encodeURIComponent(userId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(
          data?.error || "Failed to update role."
        );
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: data.user.role,
              }
            : user
        )
      );
    } catch {
      setError("Failed to update role.");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteUser(userId: string) {
    const user = users.find(
      (item) => item.id === userId
    );

    if (!user) {
      return;
    }

    const confirmed = window.confirm(
      `Remove ${user.email} from the administrator panel?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(userId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/users/${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(
          data?.error || "Failed to delete user."
        );
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.filter(
          (item) => item.id !== userId
        )
      );

      setMessage("User removed successfully.");
    } catch {
      setError("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <main className="min-h-screen bg-[#030308] px-4 py-8 text-white md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="border-b border-white/10 pb-6">
          <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-cyan-300">
            Alien Chord
          </p>

          <h1 className="font-[var(--font-syne)] text-4xl uppercase tracking-[-0.03em] md:text-6xl">
            Users
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
            Manage administrator accounts and access roles.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Add User
            </h2>

            <p className="mt-2 text-xs text-white/30">
              Add an existing Google account to the
              administrator panel.
            </p>
          </div>

          <form
            onSubmit={createUser}
            className="grid gap-4 md:grid-cols-[1fr_1fr_180px_auto]"
          >
            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Name"
              required
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50"
            />

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Google email"
              required
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50"
            />

            <select
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value as User["role"]
                )
              }
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs uppercase tracking-[0.12em] text-white/70 outline-none focus:border-cyan-400/50"
            >
              {newUserRoles.map((item) => (
                <option
                  key={item}
                  value={item}
                  className="bg-[#09090d]"
                >
                  {item}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={creating}
              className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.06] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-cyan-300 transition hover:border-cyan-300/70 hover:bg-cyan-300/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {creating ? "Adding..." : "Add User"}
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-xs text-red-300/80">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-3 text-xs text-cyan-300/80">
              {message}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/10 px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
              Administrator accounts
            </p>
          </div>

          {loading ? (
            <div className="px-5 py-10 text-sm text-white/30">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="px-5 py-10 text-sm text-white/30">
              No users found.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white/80">
                      {user.name || "Unnamed user"}
                    </p>

                    <p className="mt-1 truncate text-xs text-white/40">
                      {user.email}
                    </p>

                    {user.phone && (
                      <p className="mt-1 text-xs text-white/25">
                        {user.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {user.googleVerified && (
                      <span className="hidden rounded-full border border-cyan-400/20 px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] text-cyan-300/70 md:inline-block">
                        Google
                      </span>
                    )}

                    <select
                      value={user.role}
                      disabled={
                        savingId === user.id ||
                        deletingId === user.id
                      }
                      onChange={(event) =>
                        changeRole(
                          user.id,
                          event.target.value as User["role"]
                        )
                      }
                      className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs uppercase tracking-[0.12em] text-white/70 outline-none transition focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {roles.map((item) => (
                        <option
                          key={item}
                          value={item}
                          className="bg-[#09090d]"
                        >
                          {item}
                        </option>
                      ))}
                    </select>

                    {user.role !== "OWNER" && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteUser(user.id)
                        }
                        disabled={
                          deletingId === user.id ||
                          savingId === user.id
                        }
                        className="rounded-xl border border-red-400/20 px-4 py-2.5 text-[10px] uppercase tracking-[0.15em] text-red-300/70 transition hover:border-red-400/40 hover:bg-red-400/[0.05] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {deletingId === user.id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}