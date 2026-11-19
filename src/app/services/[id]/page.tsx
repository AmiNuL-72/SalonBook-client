"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSalon } from "../../../context/salon-context";
import { useAuth } from "../../../context/auth-context";
import BookingModal from "../../../components/booking-modal";
import {
  Clock,
  ArrowLeft,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Star,
} from "lucide-react";

function ServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;

  const { getServiceById, services } = useSalon();
  const { user, isAuthenticated, isAdmin, isCustomer } = useAuth();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const service = getServiceById(serviceId);

  // If service ID is invalid
  if (!service) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center border border-stone-200 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            Service Not Found
          </h2>
          <p className="text-stone-500 text-sm mb-6 leading-relaxed">
            The salon treatment with ID <code className="bg-stone-100 px-2 py-0.5 rounded text-xs">{serviceId}</code> could not be located in our catalog.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Browse Services</span>
          </Link>
        </div>
      </div>
    );
  }

  const isInactive = service.status === "inactive";

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/services/${service.id}`);
      return;
    }
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pb-24">
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-stone-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Salon Services</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Big Image & Visual Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-lg bg-stone-100 max-h-[500px]">
              <img
                src={service.image}
                alt={service.serviceName}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-white/95 text-stone-900 shadow-sm backdrop-blur-xs">
                  {service.category}
                </span>
                {isInactive ? (
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-rose-500 text-white shadow-sm">
                    Currently Inactive
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-600 text-white shadow-sm">
                    Active & Available
                  </span>
                )}
              </div>
            </div>

            {/* Treatment Highlights */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                What to Expect During Your Appointment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Complimentary organic tea or champagne upon arrival.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>One-on-one consultation with certified senior artist.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Cruelty-free & sulfate-free luxury salon formulas.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Personalized aftercare & home styling roadmap.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Service Information & Booking Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-amber-700 text-xs font-bold uppercase tracking-wider block mb-1">
                  {service.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                  {service.serviceName}
                </h1>

                {/* Rating & reviews */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-stone-900">
                      {service.rating || "4.9"}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs text-stone-500">
                    ({service.reviewCount || 85} verified reviews)
                  </span>
                </div>
              </div>

              {/* Price & Duration Badge Card */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">Session Fee</span>
                  <span className="text-3xl font-serif font-bold text-stone-900">
                    ${service.price}
                  </span>
                  <span className="text-xs text-stone-500 ml-1">USD</span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Duration</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-800">
                    <Clock className="w-4 h-4 text-amber-600" />
                    {service.duration} Minutes
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Service Description
                </h4>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Booking CTA according to Rules */}
              <div className="pt-2 border-t border-stone-100">
                {isInactive ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                    <p className="text-xs font-semibold text-rose-800">
                      This service is currently marked Inactive.
                    </p>
                    <p className="text-[11px] text-rose-600 mt-1">
                      Per assignment rules, appointment requests cannot be made for inactive services.
                    </p>
                  </div>
                ) : isAdmin ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <p className="text-xs font-semibold text-amber-800">
                      Logged in as Salon Administrator
                    </p>
                    <p className="text-[11px] text-amber-700 mt-1">
                      Admins cannot submit customer appointment requests. Switch to customer preview or customer account to test booking.
                    </p>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleBookingClick}
                      className="w-full py-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>Sign In to Request Appointment</span>
                    </button>
                    <p className="text-[11px] text-stone-500 text-center">
                      Authentication is required to place salon bookings.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => setBookingModalOpen(true)}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Request Appointment Now</span>
                    </button>
                    <p className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>No upfront payment required until admin confirms slot</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reassurance Guarantee card */}
            <div className="p-5 rounded-2xl bg-stone-900 text-stone-300 border border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-serif text-sm font-bold">
                <Sparkles className="w-4 h-4" />
                <span>The SalonBook Promise</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Enjoy flexible cancellation up to 24 hours prior to appointment time. 100% satisfaction guarantee or we will adjust your service at no additional charge.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {service && (
        <BookingModal
          service={service}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function ServiceDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-12 text-center text-xs text-stone-400">Loading service details...</div>}>
      <ServiceDetailsContent />
    </Suspense>
  );
}
