"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function ClientPathnameHandler({ session }: { session?: any }) {
  const pathname = usePathname();
  const router = useRouter();

  if (!pathname || !session) return;

  const role = session?.user?.role;

  if(role === "property_owner"){
    const resortAdminPaths = [
      "/admin/resorts",
      "/admin/resorts/",
      "/admin/resorts/add",
      "/admin/resorts/add/",
      "/admin/user-profile",
      "/admin/user-profile/"
    ];

    const isEditPage = pathname.startsWith("/admin/resorts/edit/");

    const isProtected = resortAdminPaths.includes(pathname) || isEditPage;

    if (!isProtected) {
      redirect("/admin/resorts");
    }
  }
  return null;
}
