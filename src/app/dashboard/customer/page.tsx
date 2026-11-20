"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useSalon } from "@/context/salon-context";
import { dashboardApi } from "@/services/api";
import StatsCard from "@/components/dashboard/stats-card";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Scissors,
} from "lucide-react";

export default function CustomerOverviewPage() {
  const { user } = useAuth();
  const { getAppointmentsForUser } = useSalon();
  const [remoteStats, setRemoteStats] = useState<{
    totalAppointments?: number;
    pendingAppointments?: number;
    confirmedAppointments?: number;
    cancelledAppointments?: number;
  } | null>(null);

  useEffect(() => {
    dashboardApi
      .getStats()
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setRemoteStats(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const myAppointments = user ? getAppointmentsForUser(user.id) : [];

  const totalRequests = remoteStats?.totalAppointments ?? myAppointments.length;
  const pendingCount =
    remoteStats?.pendingAppointments ?? myAppointments.filter((a) => a.status === "pending").length;
  const confirmedCount =
    remoteStats?.confirmedAppointments ?? myAppointments.filter((a) => a.status === "confirmed").length;
  const cancelledCount =
    remoteStats?.cancelledAppointments ?? myAppointments.filter((a) => a.status === "cancelled").length;

  const recentAppointments = myAppointments.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-stone-800">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Concierge Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Welcome, {user?.name}
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
            Manage your personal salon reservations, review confirmation updates,
            and pay securely for your upcoming sessions.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition active:scale-95 shadow-md"
            >
              <Scissors className="w-3.5 h-3.5 -rotate-45" />
              <span>Book New Treatment</span>
            </Link>
            <Link
              href="/dashboard/customer/appointments"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/20 transition"
            >
              <span>View All Appointments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
          Appointment Metrics Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Requests"
            value={totalRequests}
            subtitle="All-time appointments"
            icon={Calendar}
            color="amber"
          />
          <StatsCard
            title="Pending Requests"
            value={pendingCount}
            subtitle="Awaiting salon review"
            icon={Clock}
            color="purple"
          />
          <StatsCard
            title="Confirmed"
            value={confirmedCount}
            subtitle="Approved sessions"
            icon={CheckCircle}
            color="emerald"
          />
          <StatsCard
            title="Cancelled"
            value={cancelledCount}
            subtitle="Voided requests"
            icon={XCircle}
            color="rose"
          />
        </div>
      </div>

      {/* Recent Appointments Preview */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Recent Appointment Activity
            </h3>
            <p className="text-xs text-stone-500">
              Your latest submitted salon bookings and status updates
            </p>
          </div>
          <Link
            href="/dashboard/customer/appointments"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition flex items-center gap-1"
          >
            <span>Full Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-150">
            <p className="text-sm font-medium text-stone-600 mb-2">
              No appointments scheduled yet.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:underline"
            >
              <span>Explore services catalog to request your first booking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentAppointments.map((apt) => (
              <div
                key={apt.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={apt.serviceImage}
                    alt={apt.serviceName}
                    className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                  />
                  <div>
                    <h4 className="text-sm font-serif font-bold text-stone-900">
                      {apt.serviceName}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {apt.appointmentDate} • {apt.timeSlot}
                    </p>
                    <span className="text-[11px] font-medium text-amber-800">
                      ${apt.servicePrice} USD
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      apt.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : apt.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {apt.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      apt.paymentStatus === "paid"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                    }`}
                  >
                    {apt.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
