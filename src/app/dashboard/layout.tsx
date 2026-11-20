"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, isCustomer, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Rule: Unauthenticated users must be redirected to sign in
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Rule: Users must not be able to access another role's dashboard by manually changing URL
    if (pathname.startsWith("/dashboard/admin") && !isAdmin) {
      router.replace("/dashboard/customer");
      return;
    }

    if (pathname.startsWith("/dashboard/customer") && isAdmin) {
      router.replace("/dashboard/admin");
      return;
    }
  }, [isAuthenticated, isAdmin, isCustomer, isLoading, pathname, router]);

  // Loading indicator while auth is resolving
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Loading Dashboard Session...
        </p>
      </div>
    );
  }

  // Guard view
  if (!isAuthenticated) {
    return null;
  }

  // Blocked user enforcement (Page 11: Blocked users must not access protected platform features)
  if (user?.isBlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Account Access Suspended
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Your account has been restricted by the salon administrator. You cannot
            access protected booking features or manage appointments at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-stone-50/70 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
