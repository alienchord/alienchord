import AdminSidebar from "@/components/admin/AdminSidebar";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/admin/login");
  }

  const activeSession =
    await prisma.session.findFirst({
      where: {
        userId: user.id,
        expires: {
          gt: new Date(),
        },
        passwordVerified: true,
      },
      orderBy: {
        expires: "desc",
      },
    });

  if (!activeSession) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#030308] text-white">
      <div className="flex min-h-screen flex-col md:flex-row">
        <AdminSidebar />

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}