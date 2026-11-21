"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useSalon } from "@/context/salon-context";
import { Appointment } from "@/types";
import {
  Calendar,
  Clock,
  CreditCard,
  XCircle,
  Eye,
  CheckCircle2,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerAppointmentsPage() {
  const { user } = useAuth();
  const { getAppointmentsForUser, cancelAppointment, processStripePayment } = useSalon();

  const [payingAptId, setPayingAptId] = useState<string | null>(null);
  const [selectedAptDetails, setSelectedAptDetails] = useState<Appointment | null>(null);
  const [aptToCancel, setAptToCancel] = useState<string | null>(null);

  const appointments = user ? getAppointmentsForUser(user.id) : [];

  const confirmCancelAction = async () => {
    if (!user || !aptToCancel) return;
    await cancelAppointment(aptToCancel, user.id);
    setAptToCancel(null);
  };

  const handleCancel = (aptId: string) => {
    setAptToCancel(aptId);
  };

  const handlePay = async (apt: Appointment) => {
    if (apt.status !== "confirmed") {
      toast.error("You can only pay for confirmed appointments.");
      return;
    }
    if (apt.paymentStatus === "paid") {
      toast.error("This appointment is already paid.");
      return;
    }

    setPayingAptId(apt.id);
    toast.loading("Redirecting to Stripe Checkout...", { id: "stripe-pay" });

    // Simulate Stripe checkout redirect & webhook processing
    setTimeout(async () => {
      const ok = await processStripePayment(apt.id);
      setPayingAptId(null);
      if (ok) {
        toast.success("Payment verified via Stripe Webhook! Status updated to Paid.", {
          id: "stripe-pay",
        });
      } else {
        toast.error("Payment could not be completed.", { id: "stripe-pay" });
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            My Appointments
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Review your booking requests, cancel pending sessions, and pay for confirmed appointments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">
            Total Bookings: <strong className="text-stone-900">{appointments.length}</strong>
          </span>
        </div>
      </div>

      {/* Appointment Rules Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-0.5">
          <p className="font-semibold">Booking & Payment Guidelines:</p>
          <p>
            • Pending requests can be cancelled anytime before admin confirmation.
          </p>
          <p>
            • Once confirmed by salon staff, you can proceed to secure Stripe checkout.
          </p>
        </div>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
            No Appointment Requests Found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            You haven&apos;t requested any salon services yet. Browse our treatments to schedule your first session!
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
          >
            <span>Explore Services</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const isPending = apt.status === "pending";
            const isConfirmed = apt.status === "confirmed";
            const isCancelled = apt.status === "cancelled";
            const isPaid = apt.paymentStatus === "paid";
            const canPay = isConfirmed && !isPaid;

            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-amber-300 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Service info */}
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={apt.serviceImage}
                      alt={apt.serviceName}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          {apt.category}
                        </span>
                        <span className="text-xs text-stone-400">ID: {apt.id}</span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-stone-900">
                        {apt.serviceName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {apt.appointmentDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {apt.timeSlot}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-stone-900">
                          ${apt.servicePrice} USD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Statuses & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                    <div className="flex items-center gap-2">
                      {/* Appointment Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          isConfirmed
                            ? "bg-emerald-100 text-emerald-800"
                            : isPending
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {apt.status}
                      </span>

                      {/* Payment Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}
                      >
                        {apt.paymentStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* View Details modal toggle */}
                      <button
                        onClick={() => setSelectedAptDetails(apt)}
                        className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Cancel pending appointment button (Only allowed when Pending) */}
                      {isPending && (
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                        >
                          Cancel Request
                        </button>
                      )}

                      {/* Pay Now Button (Only allowed when Confirmed & Unpaid) */}
                      {canPay && (
                        <button
                          onClick={() => handlePay(apt)}
                          disabled={payingAptId === apt.id}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{payingAptId === apt.id ? "Connecting Stripe..." : "Pay Now with Stripe"}</span>
                        </button>
                      )}

                      {isPaid && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold px-2 py-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Receipt Confirmed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional customer message if present */}
                {apt.message && (
                  <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 border border-stone-150">
                    <span className="font-semibold text-stone-700">Special Notes: </span>
                    <span>&quot;{apt.message}&quot;</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAptDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-150">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Appointment Summary
              </h3>
              <button
                onClick={() => setSelectedAptDetails(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div>
                <p className="text-stone-400 uppercase text-[10px] font-bold">Treatment</p>
                <p className="font-semibold text-sm text-stone-900">
                  {selectedAptDetails.serviceName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-stone-400 uppercase text-[10px] font-bold">Date</p>
                  <p className="font-medium">{selectedAptDetails.appointmentDate}</p>
                </div>
                <div>
                  <p className="text-stone-400 uppercase text-[10px] font-bold">Time Slot</p>
                  <p className="font-medium">{selectedAptDetails.timeSlot}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-stone-400 uppercase text-[10px] font-bold">Appointment Status</p>
                  <p className="font-bold uppercase text-amber-700">
                    {selectedAptDetails.status}
                  </p>
                </div>
                <div>
                  <p className="text-stone-400 uppercase text-[10px] font-bold">Payment Status</p>
                  <p className="font-bold uppercase text-stone-900">
                    {selectedAptDetails.paymentStatus}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-stone-400 uppercase text-[10px] font-bold">Session Fee</p>
                <p className="text-base font-serif font-bold text-stone-900">
                  ${selectedAptDetails.servicePrice} USD
                </p>
              </div>

              <div>
                <p className="text-stone-400 uppercase text-[10px] font-bold">Requested On</p>
                <p className="font-medium text-stone-500">
                  {new Date(selectedAptDetails.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedAptDetails(null)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
            >
              Close Summary
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Appointment Cancellation */}
      {aptToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Cancel Appointment?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Are you sure you want to cancel this pending appointment request? This action cannot be reversed.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAptToCancel(null)}
                className="py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={confirmCancelAction}
                className="py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
