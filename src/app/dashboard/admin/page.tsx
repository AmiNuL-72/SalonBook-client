"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useSalon } from "@/context/salon-context";
import { dashboardApi } from "@/services/api";
import StatsCard from "@/components/dashboard/stats-card";
import {
  Users,
  Scissors,
  Calendar,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowRight,
  Plus,
} from "lucide-react";

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const { services, appointments, users, transactions } = useSalon();
  const [remoteStats, setRemoteStats] = useState<{
    totalCustomers?: number;
    activeServices?: number;
    totalActiveServices?: number;
    totalAppointments?: number;
    pendingAppointments?: number;
    confirmedAppointments?: number;
    totalRevenue?: number;
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

  // Metrics according to PDF specifications:
  // - Total Registered Customers
  // - Total Active Services
  // - Total Appointment Requests
  // - Pending Appointments
  // - Confirmed Appointments
  // - Total Successful Payments
  const totalCustomers =
    remoteStats?.totalCustomers ?? users.filter((u) => u.role === "customer").length;
  const activeServicesCount =
    remoteStats?.totalActiveServices ?? services.filter((s) => s.status === "active").length;
  const totalAppointments =
    remoteStats?.totalAppointments ?? appointments.length;
  const pendingAppointments =
    remoteStats?.pendingAppointments ?? appointments.filter((a) => a.status === "pending").length;
  const confirmedAppointments =
    remoteStats?.confirmedAppointments ?? appointments.filter((a) => a.status === "confirmed").length;
  const totalRevenue =
    remoteStats?.totalRevenue ??
    transactions
      .filter((t) => t.status === "paid")
      .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
            Salon Executive Headquarters
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Admin Master Dashboard
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm font-light mt-1">
            Welcome, {user?.name}. Monitor live booking requests, service availability, and revenue transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/admin/services"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition active:scale-95 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </Link>
          <Link
            href="/dashboard/admin/appointments"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/20 transition"
          >
            <span>Review Appointments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 6 Key Metrics Cards according to PDF */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
          Platform Performance Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Registered Customers"
            value={totalCustomers}
            subtitle="Verified customer accounts"
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Active Services"
            value={activeServicesCount}
            subtitle={`Out of ${services.length} total treatments`}
            icon={Scissors}
            color="amber"
          />
          <StatsCard
            title="Total Appointment Requests"
            value={totalAppointments}
            subtitle="All bookings received"
            icon={Calendar}
            color="purple"
          />
          <StatsCard
            title="Pending Appointments"
            value={pendingAppointments}
            subtitle="Requires staff confirmation"
            icon={Clock}
            color="rose"
          />
          <StatsCard
            title="Confirmed Appointments"
            value={confirmedAppointments}
            subtitle="Scheduled for clients"
            icon={CheckCircle}
            color="emerald"
          />
          <StatsCard
            title="Successful Payments"
            value={`$${totalRevenue.toLocaleString()} USD`}
            subtitle={`${transactions.length} verified Stripe transactions`}
            icon={DollarSign}
            color="emerald"
          />
        </div>
      </div>

      {/* Two Column Grid: Pending Review & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Requests Box */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Pending Appointment Requests ({pendingAppointments})
            </h3>
            <Link
              href="/dashboard/admin/appointments"
              className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingAppointments === 0 ? (
            <p className="text-xs text-stone-500 p-4 bg-stone-50 rounded-2xl text-center">
              All booking requests are up to date!
            </p>
          ) : (
            <div className="space-y-3">
              {appointments
                .filter((a) => a.status === "pending")
                .slice(0, 3)
                .map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl border border-stone-150 bg-stone-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-900">{apt.customerName}</p>
                      <p className="text-[11px] text-stone-500">{apt.serviceName}</p>
                      <p className="text-[10px] text-amber-800 font-medium">
                        {apt.appointmentDate} at {apt.timeSlot}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                      Pending
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent Transactions Box */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Verified Stripe Payments
            </h3>
            <Link
              href="/dashboard/admin/transactions"
              className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>View ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 3).map((txn) => (
              <div
                key={txn.id}
                className="p-3.5 rounded-2xl border border-stone-150 bg-stone-50 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-stone-900">{txn.customerName}</p>
                  <p className="text-[11px] text-stone-500">{txn.serviceName}</p>
                  <p className="text-[10px] text-stone-400 font-mono">
                    {txn.stripeSessionId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-serif font-bold text-stone-900">
                    +${txn.amount} {txn.currency}
                  </p>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
