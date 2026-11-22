"use client";

import React, { useState } from "react";
import { useSalon } from "@/context/salon-context";
import { User } from "@/types";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Phone,
  MapPin,
  Calendar,
  XCircle,
} from "lucide-react";

export default function AdminUsersPage() {
  const { users, toggleBlockUser } = useSalon();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter only registered customers (per specification: Manage Registered Customers)
  const customers = users.filter((u) => u.role === "customer");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Manage Registered Customers
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Review registered customer profiles, monitor activity, or toggle platform access
          </p>
        </div>

        <div className="text-xs text-stone-600 font-medium">
          Total Customers: <strong className="text-stone-900">{customers.length}</strong>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter customers by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase font-semibold border-b border-stone-200 tracking-wider">
              <tr>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-4">Contact Phone</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Account Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150">
              {filteredCustomers.map((cust) => {
                const isBlocked = !!cust.isBlocked;

                return (
                  <tr key={cust.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            cust.image ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                          }
                          alt={cust.name}
                          className="w-10 h-10 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <p className="font-serif font-bold text-sm text-stone-900">
                            {cust.name}
                          </p>
                          <p className="text-[11px] text-stone-500">{cust.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-stone-600">
                      {cust.phone || "Not specified"}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                        {cust.role}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {isBlocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Blocked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View user details */}
                        <button
                          onClick={() => setSelectedUser(cust)}
                          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition"
                          title="View User Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Block / Unblock User */}
                        <button
                          onClick={() => toggleBlockUser(cust.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isBlocked
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "border border-rose-200 text-rose-600 hover:bg-rose-50"
                          }`}
                        >
                          {isBlocked ? "Unblock User" : "Block User"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-150">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Customer Dossier
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedUser.image}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
              />
              <div>
                <h4 className="font-serif font-bold text-base text-stone-900">
                  {selectedUser.name}
                </h4>
                <p className="text-xs text-stone-500">{selectedUser.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {selectedUser.role}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Phone: {selectedUser.phone || "None registered"}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Address: {selectedUser.address || "None registered"}</span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Customer Since: {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-stone-150 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
