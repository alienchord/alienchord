"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const menuItems = [
{
label: "Dashboard",
href: "/admin",
roles: ["OWNER", "ADMIN", "EDITOR", "VIEWER"],
},
{
label: "Website",
href: "/admin/website",
roles: ["OWNER", "ADMIN", "EDITOR", "VIEWER"],
},
{
label: "Releases",
href: "/admin/releases",
roles: ["OWNER", "ADMIN", "EDITOR", "VIEWER"],
},
{
label: "Visuals",
href: "/admin/media",
roles: ["OWNER", "ADMIN", "EDITOR", "VIEWER"],
},
{
label: "Analytics",
href: "/admin/analytics",
roles: ["OWNER", "ADMIN"],
},
{
label: "Users",
href: "/admin/users",
roles: ["OWNER"],
},
{
label: "Security",
href: "/admin/security",
roles: ["OWNER"],
},
];

export default function AdminSidebar() {
const { data: session } = useSession();

const role = session?.user?.role;

const visibleMenuItems = menuItems.filter((item) =>
role ? item.roles.includes(role) : false
);

return (
<aside
className="
w-full
shrink-0
border-b
border-white/10
bg-white/[0.03]
backdrop-blur-xl
p-6

    md:sticky
    md:top-0
    md:flex
    md:h-screen
    md:min-h-screen
    md:w-64
    md:flex-col
    md:self-start
    md:overflow-y-auto
    md:border-b-0
    md:border-r
  "
>
  <div className="flex items-center justify-between md:block">
    <Link
      href="/admin"
      className="
        font-[var(--font-syne)]
        text-lg
        tracking-[0.25em]
        text-white
        transition-colors
        duration-300
        hover:text-cyan-300
      "
    >
      ALIEN CHORD
    </Link>

    <span
      className="
        text-[9px]
        uppercase
        tracking-[0.3em]
        text-cyan-300/50
        md:mt-2
        md:block
      "
    >
      ADMIN
    </span>
  </div>

  <nav
    className="
      mt-8
      flex
      gap-5
      overflow-x-auto
      text-[11px]
      uppercase
      tracking-[0.18em]
      text-white/45

      md:mt-12
      md:flex-col
      md:gap-5
      md:overflow-visible
      md:text-sm
      md:normal-case
      md:tracking-normal
    "
  >
    {visibleMenuItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="
          shrink-0
          transition-colors
          duration-300
          hover:text-cyan-300
        "
      >
        {item.label}
      </Link>
    ))}
  </nav>

  <div
    className="
      mt-8
      border-t
      border-white/10
      pt-5

      md:mt-auto
      md:pt-6
    "
  >
    <Link
      href="/"
      className="
        inline-flex
        items-center
        gap-2
        text-[10px]
        uppercase
        tracking-[0.2em]
        text-white/30
        transition-colors
        duration-300
        hover:text-cyan-300
      "
    >
      <span aria-hidden="true">←</span>
      Вернуться на сайт
    </Link>
  </div>
</aside>

);
}