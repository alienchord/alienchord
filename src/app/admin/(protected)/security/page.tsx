import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

import SecurityClient from "./SecurityClient";

export default async function SecurityPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const user = await getPrisma().user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user || user.role !== Role.OWNER) {
    redirect("/admin");
  }

  return <SecurityClient />;
}