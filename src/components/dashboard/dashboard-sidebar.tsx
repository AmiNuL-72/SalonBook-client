"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  User,
  Sparkles,
  Layers,
  Users,
  CreditCard,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isCustomer, logout } = useAuth();

  const customerNavItems = [
    {
      label: "Overview",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Appointments",
      href: "/dashboard/customer/appointments",
      icon: Calendar,
    },
    {
      label: "My Profile",
      href: "/dashboard/customer/profile",
      icon: User,
    },
  ];

  const adminNavItems = [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Manage Services",
      href: "/dashboard/admin/services",
      icon: Layers,
    },
    {
      label: "Manage Appointments",
      href: "/dashboard/admin/appointments",
      icon: Calendar,
    },
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    {
      label: "Admin Profile",
      href: "/dashboard/admin/profile",
      icon: User,
    },
  ];

  const navItems = isAdmin ? adminNavItems : customerNavItems;

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-stone-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-6rem)]">
      {/* Top section */}
      <div className="p-6">
        {/* User Card */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-6 flex items-center gap-3">
          <img
            src={
              user?.image ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
            }
            alt={user?.name || "Avatar"}
            className="w-10 h-10 rounded-full object-cover border border-amber-400"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-serif font-bold text-stone-900 truncate">
              {user?.name}
            </p>
            <span
              className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                isAdmin
                  ? "bg-purple-100 text-purple-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
            {isAdmin ? "Admin Controls" : "Customer Portal"}
          </p>
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-stone-900 text-amber-400 shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="p-6 border-t border-stone-200 space-y-2">
        <Link
          href="/services"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
        >
          <Scissors className="w-3.5 h-3.5 text-amber-600 -rotate-45" />
          <span>Browse Public Services</span>
        </Link>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
