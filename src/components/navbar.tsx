"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import {
  Menu,
  X,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Scissors,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isCustomer, logout, switchRolePreview } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle sticky blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const dashboardHref = isAdmin
    ? "/dashboard/admin"
    : "/dashboard/customer";

  return (
    <>
      {/* Quick Role Switcher bar for review & testing */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-400">Demo Role Quick Switch:</span>
            <div className="inline-flex rounded-md shadow-xs bg-stone-800 p-0.5 border border-stone-700">
              <button
                onClick={() => switchRolePreview("customer")}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition ${
                  isCustomer
                    ? "bg-amber-600 text-white"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => switchRolePreview("admin")}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition ${
                  isAdmin
                    ? "bg-amber-600 text-white"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => switchRolePreview("guest")}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition ${
                  !isAuthenticated
                    ? "bg-amber-600 text-white"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                Guest
              </button>
            </div>
          </div>
          <div className="text-stone-400 hidden sm:block">
            {isAuthenticated ? (
              <span>
                Active Session: <strong className="text-amber-400">{user?.name}</strong> ({user?.role})
              </span>
            ) : (
              <span>Browsing as Guest Visitor</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Header / Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3"
            : "bg-white border-b border-stone-200 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-sm group-hover:bg-amber-500 group-hover:text-stone-900 transition-colors">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold tracking-tight text-stone-900">
                  Salon<span className="text-amber-600">Book</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-600 font-medium -mt-1">
                  Luxury & Aesthetics
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "text-amber-600 font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Home
              </Link>
              <Link
                href="/services"
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith("/services")
                    ? "text-amber-600 font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Browse Services
              </Link>

              {isAuthenticated && (
                <Link
                  href={dashboardHref}
                  className={`text-sm font-medium transition-colors ${
                    pathname.startsWith("/dashboard")
                      ? "text-amber-600 font-semibold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-stone-700 hover:text-stone-950 px-3.5 py-2 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center text-sm font-medium px-5 py-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 shadow-sm transition active:scale-95"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-stone-200 hover:border-amber-400 bg-stone-50 transition"
                  >
                    <img
                      src={
                        user?.image ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                      }
                      alt={user?.name || "User Avatar"}
                      className="w-8 h-8 rounded-full object-cover border border-stone-300"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold text-stone-900 leading-tight">
                        {user?.name}
                      </p>
                      <p className="text-[10px] text-amber-700 uppercase font-medium">
                        {user?.role}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-stone-500" />
                  </button>

                  {/* Profile Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-150 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-sm font-semibold text-stone-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold uppercase">
                          {user?.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          href={dashboardHref}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-stone-500" />
                          Dashboard
                        </Link>
                        <Link
                          href={`${dashboardHref}/profile`}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition"
                        >
                          <UserIcon className="w-4 h-4 text-stone-500" />
                          My Profile
                        </Link>
                      </div>

                      <div className="border-t border-stone-100 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            router.push("/");
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-stone-700 hover:bg-stone-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                pathname === "/" ? "bg-amber-50 text-amber-700" : "text-stone-700"
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                pathname.startsWith("/services")
                  ? "bg-amber-50 text-amber-700"
                  : "text-stone-700"
              }`}
            >
              Browse Services
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    pathname.startsWith("/dashboard")
                      ? "bg-amber-50 text-amber-700"
                      : "text-stone-700"
                  }`}
                >
                  Dashboard ({user?.role})
                </Link>
                <Link
                  href={`${dashboardHref}/profile`}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-stone-700"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 rounded-lg border border-stone-300 font-medium text-stone-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2.5 rounded-lg bg-stone-900 text-white font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
