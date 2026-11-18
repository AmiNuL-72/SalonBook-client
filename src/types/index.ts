export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  isBlocked?: boolean;
  createdAt?: string;
}

export type ServiceCategory =
  | "Haircut & Styling"
  | "Hair Coloring"
  | "Hair Treatment"
  | "Facial & Skincare"
  | "Makeup"
  | "Manicure & Pedicure"
  | "Spa & Massage";

export interface SalonService {
  id: string;
  serviceName: string;
  category: ServiceCategory;
  description: string;
  price: number;
  duration: number; // in minutes
  image: string;
  status: "active" | "inactive";
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  category: ServiceCategory;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 11:00 AM"
  message?: string;
  servicePrice: number;
  paymentStatus: PaymentStatus;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  serviceName: string;
  appointmentDate: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
}
