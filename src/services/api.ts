import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")
    ? "https://salonbook-server-as9.vercel.app/api"
    : "http://localhost:5000/api");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor to inject JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("salonbook_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Endpoints
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password?: string;
    image?: string;
    phone?: string;
  }) => apiClient.post("/auth/register", data),

  login: (data: { email: string; password?: string }) =>
    apiClient.post("/auth/login", data),

  googleAuth: (data: { email: string; name?: string; image?: string }) =>
    apiClient.post("/auth/google", data),

  getMe: () => apiClient.get("/auth/me"),

  updateProfile: (data: {
    name?: string;
    phone?: string;
    address?: string;
    image?: string;
  }) => apiClient.patch("/auth/profile", data),
};

// Services Endpoints
export const serviceApi = {
  getServices: (params?: {
    search?: string;
    category?: string;
    sort?: string;
    status?: string;
    all?: boolean;
  }) => apiClient.get("/services", { params }),

  getFeatured: () => apiClient.get("/services/featured"),

  getById: (id: string) => apiClient.get(`/services/${id}`),

  create: (data: Record<string, unknown>) => apiClient.post("/services", data),

  update: (id: string, data: Record<string, unknown>) => apiClient.patch(`/services/${id}`, data),

  delete: (id: string) => apiClient.delete(`/services/${id}`),

  toggleStatus: (id: string) => apiClient.patch(`/services/${id}/status`),
};

// Appointments Endpoints
export const appointmentApi = {
  create: (data: {
    serviceId: string;
    appointmentDate: string;
    timeSlot: string;
    message?: string;
  }) => apiClient.post("/appointments", data),

  getMyAppointments: () => apiClient.get("/appointments/my"),

  getAllAppointments: () => apiClient.get("/appointments"),

  cancel: (id: string) => apiClient.patch(`/appointments/${id}/cancel`),

  confirm: (id: string) => apiClient.patch(`/appointments/${id}/confirm`),
};

// Payments & Stripe Endpoints
export const paymentApi = {
  createCheckoutSession: (appointmentId: string) =>
    apiClient.post("/payments/create-checkout-session", { appointmentId }),

  verifyPaymentSession: (sessionId: string, appointmentId: string) =>
    apiClient.post("/payments/verify-session", { sessionId, appointmentId }),

  getTransactions: () => apiClient.get("/payments/transactions"),
};

// User Management (Admin)
export const userApi = {
  getUsers: () => apiClient.get("/users"),
  toggleBlock: (id: string) => apiClient.patch(`/users/${id}/block`),
};

// Dashboard Stats
export const dashboardApi = {
  getStats: () => apiClient.get("/dashboard/stats"),
};
