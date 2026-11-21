"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, Sparkles } from "lucide-react";
import { paymentApi } from "../../../services/api";
import { useSalon } from "../../../context/salon-context";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const appointmentId = searchParams.get("appointment_id");
  const { refreshData } = useSalon();

  useEffect(() => {
    if (appointmentId) {
      paymentApi
        .verifyPaymentSession(sessionId || "", appointmentId)
        .then(() => refreshData())
        .catch((err) => console.warn("[Payment Success] Verification notice:", err));
    }
  }, [appointmentId, sessionId, refreshData]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-stone-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stripe Payment Confirmed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Payment Completed!
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            Your salon appointment has been fully paid and verified via our Stripe service. We look forward to welcoming you!
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1 text-left">
          <div className="flex justify-between">
            <span className="text-stone-400">Payment Status:</span>
            <span className="font-bold text-emerald-700 uppercase">Paid</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Confirmation Method:</span>
            <span className="font-medium text-stone-800">Verified Stripe Payment</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/dashboard/customer/appointments"
            className="w-full py-3.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>View in My Appointments</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-stone-500 hover:text-stone-900 transition"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-stone-400">Confirming payment...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
