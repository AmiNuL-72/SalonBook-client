"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SalonService, Appointment, Transaction, User } from "../types";
import {
  INITIAL_SERVICES,
  INITIAL_APPOINTMENTS,
  INITIAL_TRANSACTIONS,
  MOCK_USERS,
} from "../data/mock-data";
import {
  serviceApi,
  appointmentApi,
  paymentApi,
  userApi,
  authApi,
} from "../services/api";
import toast from "react-hot-toast";

interface SalonContextType {
  // Services
  services: SalonService[];
  activeServices: SalonService[];
  featuredServices: SalonService[];
  getServiceById: (id: string) => SalonService | undefined;
  addService: (service: Omit<SalonService, "id" | "createdAt">) => Promise<void>;
  updateService: (id: string, updates: Partial<SalonService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string) => Promise<void>;

  // Appointments
  appointments: Appointment[];
  getAppointmentsForUser: (userId: string) => Appointment[];
  bookAppointment: (params: {
    service: SalonService;
    customer: User;
    appointmentDate: string;
    timeSlot: string;
    message?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  cancelAppointment: (appointmentId: string, userId: string, isAdmin?: boolean) => Promise<boolean>;
  confirmAppointment: (appointmentId: string) => Promise<boolean>;

  // Payments / Transactions
  transactions: Transaction[];
  processStripePayment: (appointmentId: string) => Promise<boolean>;

  // Users management (Admin)
  users: User[];
  toggleBlockUser: (userId: string) => Promise<void>;

  // Loading states
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export function SalonProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<SalonService[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync helpers
  const persistServices = (list: SalonService[]) => {
    setServices(list);
    try {
      localStorage.setItem("salonbook_services", JSON.stringify(list));
    } catch {}
  };

  const persistAppointments = (list: Appointment[]) => {
    setAppointments(list);
    try {
      localStorage.setItem("salonbook_appointments", JSON.stringify(list));
    } catch {}
  };

  const persistTransactions = (list: Transaction[]) => {
    setTransactions(list);
    try {
      localStorage.setItem("salonbook_transactions", JSON.stringify(list));
    } catch {}
  };

  const persistUsers = (list: User[]) => {
    setUsers(list);
    try {
      localStorage.setItem("salonbook_users", JSON.stringify(list));
    } catch {}
  };

  // Fetch live data from backend server if available
  const refreshData = async () => {
    try {
      // 1. Services
      const srvRes = await serviceApi.getServices({ all: true });
      if (srvRes.data?.success && Array.isArray(srvRes.data?.data) && srvRes.data.data.length > 0) {
        persistServices(srvRes.data.data);
      }
    } catch {}

    try {
      // 2. Appointments
      const aptRes = await appointmentApi.getAllAppointments();
      if (aptRes.data?.success && Array.isArray(aptRes.data?.data)) {
        persistAppointments(aptRes.data.data);
      }
    } catch {}

    try {
      // 3. Transactions
      const txnRes = await paymentApi.getTransactions();
      if (txnRes.data?.success && Array.isArray(txnRes.data?.data)) {
        persistTransactions(txnRes.data.data);
      }
    } catch {}

    try {
      // 4. Users
      const usrRes = await userApi.getUsers();
      if (usrRes.data?.success && Array.isArray(usrRes.data?.data)) {
        persistUsers(usrRes.data.data);
      }
    } catch {}
  };

  // Safe client hydration sync
  useEffect(() => {
    const syncFromStorage = async () => {
      try {
        const storedServices = localStorage.getItem("salonbook_services");
        if (storedServices) setServices(JSON.parse(storedServices));

        const storedAppointments = localStorage.getItem("salonbook_appointments");
        if (storedAppointments) setAppointments(JSON.parse(storedAppointments));

        const storedTransactions = localStorage.getItem("salonbook_transactions");
        if (storedTransactions) setTransactions(JSON.parse(storedTransactions));

        const storedUsers = localStorage.getItem("salonbook_users");
        if (storedUsers) setUsers(JSON.parse(storedUsers));
      } catch {}

      await refreshData();
    };

    syncFromStorage();
  }, []);

  // Filtered views
  const activeServices = services.filter((s) => s.status === "active");
  const featuredServices =
    activeServices.filter((s) => s.featured).length >= 6
      ? activeServices.filter((s) => s.featured)
      : activeServices.slice(0, 6);

  const getServiceById = (id: string) => {
    return services.find((s) => s.id === id);
  };

  // Admin: Add Service
  const addService = async (data: Omit<SalonService, "id" | "createdAt">) => {
    if (data.price <= 0 || data.duration <= 0) {
      toast.error("Price and duration must be positive numbers.");
      return;
    }

    try {
      const res = await serviceApi.create(data);
      if (res.data?.success && res.data?.data) {
        const newService = res.data.data;
        const updated = [newService, ...services];
        persistServices(updated);
        toast.success(`Service "${data.serviceName}" created successfully!`);
        return;
      }
    } catch (err: unknown) {
      console.warn("[Services] Create API error, using local state:", err);
    }

    const newService: SalonService = {
      ...data,
      id: `srv-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newService, ...services];
    persistServices(updated);
    toast.success(`Service "${data.serviceName}" created successfully!`);
  };

  // Admin: Update Service
  const updateService = async (id: string, updates: Partial<SalonService>) => {
    if (updates.price !== undefined && updates.price <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }
    if (updates.duration !== undefined && updates.duration <= 0) {
      toast.error("Duration must be a positive number.");
      return;
    }

    try {
      const res = await serviceApi.update(id, updates);
      if (res.data?.success && res.data?.data) {
        const updated = services.map((s) => (s.id === id ? { ...s, ...res.data.data } : s));
        persistServices(updated);
        toast.success("Service updated successfully!");
        return;
      }
    } catch (err) {
      console.warn("[Services] Update API error, fallback locally:", err);
    }

    const updated = services.map((s) => (s.id === id ? { ...s, ...updates } : s));
    persistServices(updated);
    toast.success("Service updated successfully!");
  };

  // Admin: Delete Service
  const deleteService = async (id: string) => {
    try {
      await serviceApi.delete(id);
    } catch (err) {
      console.warn("[Services] Delete API error, deleting locally:", err);
    }
    const updated = services.filter((s) => s.id !== id);
    persistServices(updated);
    toast.success("Service removed from catalog.");
  };

  // Admin: Toggle Service Status
  const toggleServiceStatus = async (id: string) => {
    const target = services.find((s) => s.id === id);
    if (!target) return;
    const nextStatus = target.status === "active" ? "inactive" : "active";

    try {
      await serviceApi.toggleStatus(id);
    } catch (err) {
      console.warn("[Services] Toggle API error, toggling locally:", err);
    }

    const updated = services.map((s) =>
      s.id === id ? { ...s, status: nextStatus as "active" | "inactive" } : s
    );
    persistServices(updated);
    toast.success(`Service marked as ${nextStatus}.`);
  };

  // Customer: Book appointment
  const bookAppointment = async (params: {
    service: SalonService;
    customer: User;
    appointmentDate: string;
    timeSlot: string;
    message?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    const { service, customer, appointmentDate, timeSlot, message } = params;

    if (customer.role === "admin") {
      const msg = "Admins cannot submit customer appointment requests.";
      toast.error(msg);
      return { success: false, message: msg };
    }

    if (service.status !== "active") {
      const msg = "This service is currently unavailable for booking.";
      toast.error(msg);
      return { success: false, message: msg };
    }

    // Pre-flight: Ensure backend JWT token exists for Google OAuth users
    if (typeof window !== "undefined" && !localStorage.getItem("salonbook_token") && customer.email) {
      try {
        const syncRes = await authApi.googleAuth({
          email: customer.email,
          name: customer.name,
          image: customer.image,
        });
        if (syncRes.data?.success && syncRes.data?.data?.token) {
          localStorage.setItem("salonbook_token", syncRes.data.data.token);
          if (syncRes.data.data.user) {
            localStorage.setItem("salonbook_user", JSON.stringify(syncRes.data.data.user));
          }
        }
      } catch (tokenErr) {
        console.warn("[Salon] Token sync prior to booking:", tokenErr);
      }
    }

    try {
      const res = await appointmentApi.create({
        serviceId: service.id,
        appointmentDate,
        timeSlot,
        message,
      });

      if (res.data?.success && res.data?.data) {
        const newAppointment = res.data.data;
        const updated = [newAppointment, ...appointments];
        persistAppointments(updated);
        toast.success("Appointment request submitted! Awaiting salon confirmation.");
        return { success: true };
      }
    } catch (apiErr: unknown) {
      const errRes = (apiErr as { response?: { status?: number; data?: { message?: string } } });

      // If 401 token issue, attempt one auto-sync and retry
      if (errRes?.response?.status === 401 && customer.email) {
        try {
          const syncRes = await authApi.googleAuth({
            email: customer.email,
            name: customer.name,
            image: customer.image,
          });
          if (syncRes.data?.success && syncRes.data?.data?.token) {
            localStorage.setItem("salonbook_token", syncRes.data.data.token);
            const retryRes = await appointmentApi.create({
              serviceId: service.id,
              appointmentDate,
              timeSlot,
              message,
            });
            if (retryRes.data?.success && retryRes.data?.data) {
              const newAppointment = retryRes.data.data;
              const updated = [newAppointment, ...appointments];
              persistAppointments(updated);
              toast.success("Appointment request submitted! Awaiting salon confirmation.");
              return { success: true };
            }
          }
        } catch (retryErr) {
          console.warn("[Salon] Retry booking after token sync failed:", retryErr);
        }
      }

      // If slot conflict returned from server
      if (errRes?.response?.status === 409 || errRes?.response?.data?.message?.includes("already booked")) {
        const msg = errRes.response.data?.message || "Slot already booked for this date.";
        toast.error(msg);
        return { success: false, message: msg };
      }
    }

    // Local fallback
    const hasSlotConflict = appointments.some(
      (a) =>
        a.appointmentDate === appointmentDate &&
        a.timeSlot === timeSlot &&
        a.status !== "cancelled"
    );

    if (hasSlotConflict) {
      const msg = "This time slot is already booked for this date. Please choose another slot.";
      toast.error(msg);
      return { success: false, message: msg };
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      serviceId: service.id,
      serviceName: service.serviceName,
      serviceImage: service.image,
      category: service.category,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      appointmentDate,
      timeSlot,
      message: message?.trim() || "",
      servicePrice: service.price,
      paymentStatus: "unpaid",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const updated = [newAppointment, ...appointments];
    persistAppointments(updated);
    toast.success("Appointment request submitted! Awaiting salon confirmation.");
    return { success: true };
  };

  // Cancel Appointment
  const cancelAppointment = async (appointmentId: string, userId: string, isAdmin = false) => {
    const target = appointments.find((a) => a.id === appointmentId);
    if (!target) return false;

    if (!isAdmin && target.customerId !== userId) {
      toast.error("Unauthorized: You can only cancel your own appointments.");
      return false;
    }

    if (!isAdmin && target.status !== "pending") {
      toast.error("Customers cannot cancel an already confirmed or cancelled appointment.");
      return false;
    }

    try {
      await appointmentApi.cancel(appointmentId);
    } catch (err) {
      console.warn("[Appointments] Cancel API error, fallback locally:", err);
    }

    const updated = appointments.map((a) =>
      a.id === appointmentId ? { ...a, status: "cancelled" as const } : a
    );
    persistAppointments(updated);
    toast.success("Appointment cancelled successfully.");
    return true;
  };

  // Admin: Confirm Appointment
  const confirmAppointment = async (appointmentId: string) => {
    const target = appointments.find((a) => a.id === appointmentId);
    if (!target) return false;
    if (target.status !== "pending") {
      toast.error("Only pending appointments can be confirmed.");
      return false;
    }

    try {
      await appointmentApi.confirm(appointmentId);
    } catch (err) {
      console.warn("[Appointments] Confirm API error, fallback locally:", err);
    }

    const updated = appointments.map((a) =>
      a.id === appointmentId ? { ...a, status: "confirmed" as const } : a
    );
    persistAppointments(updated);
    toast.success("Appointment confirmed! Customer can now proceed to payment.");
    return true;
  };

  // Customer: Process Payment (Stripe Checkout)
  const processStripePayment = async (appointmentId: string): Promise<boolean> => {
    const target = appointments.find((a) => a.id === appointmentId);
    if (!target) {
      toast.error("Appointment not found.");
      return false;
    }

    if (target.status !== "confirmed") {
      toast.error("Payment is only allowed for confirmed appointments.");
      return false;
    }

    if (target.paymentStatus === "paid") {
      toast.error("This appointment is already paid.");
      return false;
    }

    try {
      const res = await paymentApi.createCheckoutSession(appointmentId);
      if (res.data?.success && res.data?.url) {
        // Redirect customer to Stripe Checkout
        window.location.href = res.data.url;
        return true;
      }
    } catch (apiErr: unknown) {
      console.warn("[Payment] Stripe session initiation error:", apiErr);
    }

    // Local simulation fallback
    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      appointmentId: target.id,
      customerId: target.customerId,
      customerName: target.customerName,
      serviceName: target.serviceName,
      appointmentDate: target.appointmentDate,
      amount: target.servicePrice,
      currency: "USD",
      stripeSessionId: `cs_test_${Math.random().toString(36).substring(2, 15)}`,
      status: "paid",
      createdAt: new Date().toISOString(),
    };

    const updatedApts = appointments.map((a) =>
      a.id === appointmentId ? { ...a, paymentStatus: "paid" as const } : a
    );

    persistAppointments(updatedApts);
    persistTransactions([newTxn, ...transactions]);
    return true;
  };

  // Get appointments for a specific customer
  const getAppointmentsForUser = (userId: string) => {
    return appointments.filter((a) => a.customerId === userId);
  };

  // Admin: Block/Unblock customer
  const toggleBlockUser = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    if (target.role === "admin") {
      toast.error("Cannot block an administrator account.");
      return;
    }
    const newBlockedState = !target.isBlocked;

    try {
      await userApi.toggleBlock(userId);
    } catch (err) {
      console.warn("[Users] Toggle block API error, fallback locally:", err);
    }

    const updated = users.map((u) =>
      u.id === userId ? { ...u, isBlocked: newBlockedState } : u
    );
    persistUsers(updated);
    toast.success(`User ${target.name} has been ${newBlockedState ? "blocked" : "unblocked"}.`);
  };

  return (
    <SalonContext.Provider
      value={{
        services,
        activeServices,
        featuredServices,
        getServiceById,
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,
        appointments,
        getAppointmentsForUser,
        bookAppointment,
        cancelAppointment,
        confirmAppointment,
        transactions,
        processStripePayment,
        users,
        toggleBlockUser,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
}

export function useSalon() {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error("useSalon must be used within a SalonProvider");
  }
  return context;
}
