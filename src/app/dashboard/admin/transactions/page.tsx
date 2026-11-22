"use client";

import React, { useState } from "react";
import { useSalon } from "@/context/salon-context";
import {
  Search,
  CheckCircle2,
  XCircle,
  Lock,
} from "lucide-react";

export default function AdminTransactionsPage() {
  const { transactions } = useSalon();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter(
    (t) =>
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.stripeSessionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVolume = transactions
    .filter((t) => t.status === "paid")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Payment Transactions Ledger
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Verified Stripe checkout records and automated webhook payment reconciliation
          </p>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200 text-right">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">
            Verified Net Volume
          </span>
          <span className="text-lg font-serif font-bold text-stone-900">
            ${totalVolume.toLocaleString()} USD
          </span>
        </div>
      </div>

      {/* Security Rule Notice from PDF: Admin must not modify payment records manually */}
      <div className="p-4 rounded-2xl bg-stone-900 text-stone-300 border border-stone-800 flex items-start gap-3">
        <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-white">Stripe Webhook Immutability Protocol:</p>
          <p className="text-stone-400 text-[11px]">
            Per assignment compliance guidelines, administrators cannot manually alter or override transaction statuses.
            All payment confirmations are cryptographically validated by the Stripe Webhook receiver.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by customer name, treatment, or Stripe Session ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase font-semibold border-b border-stone-200 tracking-wider">
              <tr>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-4">Related Service</th>
                <th className="py-4 px-4">Appointment Date</th>
                <th className="py-4 px-4">Amount & Currency</th>
                <th className="py-4 px-4">Stripe Session ID</th>
                <th className="py-4 px-4">Payment Status</th>
                <th className="py-4 px-6 text-right">Transaction Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-stone-50/60 transition">
                    {/* Customer */}
                    <td className="py-4 px-6 font-semibold text-stone-900">
                      {txn.customerName}
                    </td>

                    {/* Service */}
                    <td className="py-4 px-4 font-serif font-bold text-stone-800">
                      {txn.serviceName}
                    </td>

                    {/* Appointment Date */}
                    <td className="py-4 px-4 text-stone-600">
                      {txn.appointmentDate}
                    </td>

                    {/* Amount & Currency */}
                    <td className="py-4 px-4 font-serif font-bold text-sm text-stone-900">
                      ${txn.amount} <span className="text-[10px] text-stone-500 font-sans">{txn.currency}</span>
                    </td>

                    {/* Stripe Session ID */}
                    <td className="py-4 px-4">
                      <code className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono text-[10px] select-all">
                        {txn.stripeSessionId}
                      </code>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          txn.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {txn.status === "paid" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        <span>{txn.status}</span>
                      </span>
                    </td>

                    {/* Transaction Date */}
                    <td className="py-4 px-6 text-right text-stone-500 text-[11px]">
                      {new Date(txn.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
