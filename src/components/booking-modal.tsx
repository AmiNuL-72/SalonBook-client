"use client";

import React, { useState } from "react";
import { SalonService } from "../types";
import { useAuth } from "../context/auth-context";
import { useSalon } from "../context/salon-context";
import { AVAILABLE_TIME_SLOTS } from "../data/mock-data";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface BookingModalProps {
  service: SalonService;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ service, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isCustomer } = useAuth();
  const { bookAppointment, appointments } = useSalon();

  // Get tomorrow as default minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split("T")[0];

  const [appointmentDate, setAppointmentDate] = useState<string>(minDateString);
  const [timeSlot, setTimeSlot] = useState<string>(AVAILABLE_TIME_SLOTS[0]);
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Check if chosen slot is already booked for that date
  const isSlotTaken = (slot: string) => {
    return appointments.some(
      (a) =>
        a.appointmentDate === appointmentDate &&
        a.timeSlot === slot &&
        a.status !== "cancelled"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push(`/login?redirect=/services/${service.id}`);
      return;
    }

    if (isAdmin) {
      return;
    }

    if (!user) return;

    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 500));

    const result = await bookAppointment({
      service,
      customer: user,
      appointmentDate,
      timeSlot,
      message,
    });

    setIsSubmitting(false);

    if (result.success) {
      setBookingSuccess(true);
      setTimeout(() => {
        onClose();
        setBookingSuccess(false);
        router.push("/dashboard/customer/appointments");
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Appointment Request</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-white pr-8">
            {service.serviceName}
          </h2>
          <div className="mt-2 flex items-center gap-4 text-xs text-stone-300">
            <span>${service.price} USD</span>
            <span>•</span>
            <span>{service.duration} mins session</span>
            <span>•</span>
            <span className="text-amber-300">{service.category}</span>
          </div>
        </div>

        {/* Modal Body */}
        {bookingSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Request Sent Successfully!
            </h3>
            <p className="text-sm text-stone-600">
              Your appointment request is marked as <strong>Pending</strong>. You will be
              redirected to your customer dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Admin Warning if logged in as Admin */}
            {isAdmin && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <p className="font-semibold">Logged in as Administrator</p>
                  <p>
                    Assignment rule: Salon admins cannot submit customer appointment
                    requests. Please switch to a customer account.
                  </p>
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Appointment Date</span>
              </label>
              <input
                type="date"
                min={minDateString}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm font-medium text-stone-800"
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Available Time Slot</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {AVAILABLE_TIME_SLOTS.map((slot) => {
                  const taken = isSlotTaken(slot);
                  const selected = timeSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={taken}
                      onClick={() => setTimeSlot(slot)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition flex items-center justify-between ${
                        taken
                          ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed line-through"
                          : selected
                          ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                          : "bg-white text-stone-700 border-stone-200 hover:border-amber-400"
                      }`}
                    >
                      <span>{slot}</span>
                      {taken && <span className="text-[10px] text-rose-500 font-semibold">Booked</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional message */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>Additional Message / Notes (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention allergies, hair texture, preferred stylist, or special styling goals..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm text-stone-800 placeholder:text-stone-400"
              />
            </div>

            {/* Price & Summary */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-sm">
              <div>
                <p className="text-xs text-stone-500">Service Fee (Pay upon Confirmation)</p>
                <p className="font-serif font-bold text-lg text-stone-900">
                  ${service.price} USD
                </p>
              </div>
              <div className="text-right text-xs text-stone-500">
                <span className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold">
                  Default: Pending Status
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isAdmin || isSlotTaken(timeSlot)}
                className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md active:scale-95"
              >
                {isSubmitting ? "Submitting..." : "Confirm Booking Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
