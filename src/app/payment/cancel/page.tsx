"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-stone-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Checkout Cancelled
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            Your Stripe payment session was not completed. Your appointment reservation remains confirmed, and you can try payment again at your convenience.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/dashboard/customer/appointments"
            className="w-full py-3.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Return to Appointments & Retry</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-stone-500 hover:text-stone-900 transition flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
