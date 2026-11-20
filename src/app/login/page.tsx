"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/auth-context";
import {
  Scissors,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (email.toLowerCase().includes("admin")) {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/customer");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    await loginWithGoogle();
    // Do not call router.push here; Better Auth redirects browser to Google Account Selector
    setIsSubmitting(false);
  };

  // Quick fill helper for reviewers
  const quickFillAdmin = () => {
    setEmail("admin@salonbook.com");
    setPassword("Admin123!");
  };

  const quickFillCustomer = () => {
    setEmail("demo@example.com");
    setPassword("Customer123!");
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <Scissors className="w-6 h-6 -rotate-45" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light">
          Sign in to access your appointments and salon dashboard
        </p>
      </div>

      {/* Quick Demo Credentials for evaluators */}
      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Quick Demo Fill:
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={quickFillCustomer}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white border border-stone-200 text-stone-700 hover:border-amber-400 transition"
          >
            Fill as Customer
          </button>
          <button
            type="button"
            onClick={quickFillAdmin}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white border border-stone-200 text-stone-700 hover:border-amber-400 transition"
          >
            Fill as Admin
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-amber-600" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. demo@example.com"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Password</span>
            </label>
            <span className="text-[11px] text-amber-700 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-white px-3 text-stone-400">or continue with</span>
        </div>
      </div>

      {/* Google Authentication Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="w-full py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium text-sm transition flex items-center justify-center gap-3 active:scale-95"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.35 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>Sign In with Google</span>
      </button>

      {/* Link to Sign Up */}
      <div className="text-center text-xs text-stone-500">
        Don&apos;t have a salon account yet?{" "}
        <Link href="/register" className="text-amber-700 font-semibold hover:underline">
          Register as Customer
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 bg-stone-50/50">
      <Suspense fallback={<div className="text-xs text-stone-400">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

