"use client";

import React, { useState } from "react";
import { useSalon } from "@/context/salon-context";
import { Appointment } from "@/types";
import {
  Eye,
  Search,
  Filter,
  XCircle,
} from "lucide-react";

export default function AdminAppointmentsPage() {
  const { appointments, confirmAppointment, cancelAppointment } = useSalon();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDetails, setSelectedDetails] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleConfirm = (aptId: string) => {
    confirmAppointment(aptId);
  };

  const handleCancel = (aptId: string, customerName: string) => {
    if (confirm(`Are you sure you want to cancel the appointment for ${customerName}?`)) {
      cancelAppointment(aptId, "", true); // Admin bypass true
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Manage Salon Appointments
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Review customer bookings, confirm upcoming sessions, or process cancellations
          </p>
        </div>

        <div className="text-xs text-stone-600 font-medium">
          Total Appointment Records: <strong className="text-stone-900">{appointments.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, or service title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="all">All Statuses ({appointments.length})</option>
            <option value="pending">Pending Only</option>
            <option value="confirmed">Confirmed Only</option>
            <option value="cancelled">Cancelled Only</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase font-semibold border-b border-stone-200 tracking-wider">
              <tr>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-4">Service</th>
                <th className="py-4 px-4">Date & Slot</th>
                <th className="py-4 px-4">Fee</th>
                <th className="py-4 px-4">Appointment</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No appointment records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const isPending = apt.status === "pending";
                  const isConfirmed = apt.status === "confirmed";
                  const isCancelled = apt.status === "cancelled";
                  const isPaid = apt.paymentStatus === "paid";

                  return (
                    <tr key={apt.id} className="hover:bg-stone-50/60 transition">
                      {/* Customer info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {apt.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900">{apt.customerName}</p>
                            <p className="text-[11px] text-stone-400">{apt.customerEmail}</p>
                            {apt.customerPhone && (
                              <p className="text-[10px] text-stone-500">{apt.customerPhone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-4 px-4">
                        <p className="font-serif font-bold text-stone-900 line-clamp-1 max-w-[180px]">
                          {apt.serviceName}
                        </p>
                        <span className="text-[10px] text-amber-800 font-medium">
                          {apt.category}
                        </span>
                      </td>

                      {/* Date & Time Slot */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-stone-900">{apt.appointmentDate}</p>
                        <p className="text-[11px] text-stone-500">{apt.timeSlot}</p>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-serif font-bold text-stone-900 text-sm">
                        ${apt.servicePrice}
                      </td>

                      {/* Appointment Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            isConfirmed
                              ? "bg-emerald-100 text-emerald-800"
                              : isPending
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-stone-100 text-stone-600 border border-stone-200"
                          }`}
                        >
                          {apt.paymentStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setSelectedDetails(apt)}
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition"
                            title="Inspect Booking Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Confirm pending appointment (Only allowed for Pending) */}
                          {isPending && (
                            <button
                              onClick={() => handleConfirm(apt.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 transition"
                              title="Confirm Appointment"
                            >
                              Confirm
                            </button>
                          )}

                          {/* Cancel pending or confirmed appointments */}
                          {!isCancelled && (
                            <button
                              onClick={() => handleCancel(apt.id, apt.customerName)}
                              className="px-2 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-[11px] transition"
                              title="Cancel Appointment"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-150">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Detailed Appointment Dossier
              </h3>
              <button
                onClick={() => setSelectedDetails(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Customer Box */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400">
                  Customer Profile
                </span>
                <p className="font-serif font-bold text-sm text-stone-900">
                  {selectedDetails.customerName}
                </p>
                <p className="text-stone-500">{selectedDetails.customerEmail}</p>
                {selectedDetails.customerPhone && (
                  <p className="text-stone-500">{selectedDetails.customerPhone}</p>
                )}
              </div>

              {/* Service Box */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400">
                  Requested Treatment
                </span>
                <p className="font-serif font-bold text-sm text-stone-900">
                  {selectedDetails.serviceName} ({selectedDetails.category})
                </p>
                <p className="font-medium text-stone-600">
                  Appointment Schedule: {selectedDetails.appointmentDate} at{" "}
                  {selectedDetails.timeSlot}
                </p>
                <p className="text-stone-900 font-bold font-serif text-sm">
                  Service Price: ${selectedDetails.servicePrice} USD
                </p>
              </div>

              {/* Customer Message */}
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                  Customer Message / Special Requirements
                </span>
                <p className="p-3 rounded-xl bg-stone-100 text-stone-700 italic">
                  {selectedDetails.message ? `"${selectedDetails.message}"` : "No special notes provided."}
                </p>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-stone-500 pt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Booking Request Date
                  </span>
                  <span>{new Date(selectedDetails.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Payment Status
                  </span>
                  <span className="font-bold uppercase text-stone-900">
                    {selectedDetails.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-150 flex justify-end">
              <button
                onClick={() => setSelectedDetails(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
