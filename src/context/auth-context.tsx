"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types";
import { MOCK_USERS } from "../data/mock-data";
import { authApi } from "../services/api";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    password?: string;
    image?: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  switchRolePreview: (role: UserRole | "guest") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync session on mount
  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check if user was actively an Admin in localStorage
      let restoredUser: User | null = null;
      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem("salonbook_user") : null;
        if (stored) {
          restoredUser = JSON.parse(stored);
        }
      } catch {}

      if (restoredUser && (restoredUser.role === "admin" || restoredUser.email === "admin@salonbook.com")) {
        setUser(restoredUser);
        try {
          localStorage.setItem("salonbook_saved_admin", JSON.stringify(restoredUser));
          const currentToken = localStorage.getItem("salonbook_token");
          if (currentToken) localStorage.setItem("salonbook_saved_admin_token", currentToken);
        } catch {}
        try {
          // Re-authenticate admin in background to get live MongoDB record and fresh token
          const loginRes = await authApi.login({
            email: "admin@salonbook.com",
            password: "Admin123!",
          });
          if (loginRes.data?.success && loginRes.data?.data) {
            const { token, user: freshAdmin } = loginRes.data.data;
            setUser(freshAdmin);
            if (typeof window !== "undefined") {
              localStorage.setItem("salonbook_token", token);
              localStorage.setItem("salonbook_user", JSON.stringify(freshAdmin));
              localStorage.setItem("salonbook_saved_admin", JSON.stringify(freshAdmin));
              localStorage.setItem("salonbook_saved_admin_token", token);
            }
          }
        } catch {}
        setIsLoading(false);
        return;
      }

      // 2. First check Better Auth session (e.g. after Google OAuth redirect)
      try {
        const sessionRes = await authClient.getSession();
        if (sessionRes?.data?.user) {
          const u = sessionRes.data.user;

          // Always ensure backend JWT token is synced for the Google user
          try {
            const backendRes = await authApi.googleAuth({
              email: u.email,
              name: u.name || undefined,
              image: u.image || undefined,
            });
            if (backendRes.data?.success && backendRes.data?.data) {
              const { token, user: backendUser } = backendRes.data.data;
              if (typeof window !== "undefined") {
                localStorage.setItem("salonbook_token", token);
                localStorage.setItem("salonbook_user", JSON.stringify(backendUser));
                localStorage.setItem("salonbook_saved_customer", JSON.stringify(backendUser));
                localStorage.setItem("salonbook_saved_customer_token", token);
              }
              setUser(backendUser);
              setIsLoading(false);
              return;
            }
          } catch (syncErr) {
            console.warn("[Auth] Failed to sync Google session with backend API:", syncErr);
          }

          const mappedUser: User = {
            id: u.id,
            name: u.name || "Customer",
            email: u.email,
            role: ((u as unknown) as { role?: UserRole }).role || "customer",
            image:
              u.image ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
            phone: ((u as unknown) as { phone?: string }).phone,
            address: ((u as unknown) as { address?: string }).address,
            isBlocked: ((u as unknown) as { isBlocked?: boolean }).isBlocked || false,
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
          };
          setUser(mappedUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("salonbook_user", JSON.stringify(mappedUser));
          }
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("[Auth] Better Auth session check:", err);
      }

      // 3. Check standard restored session from local storage
      if (restoredUser) {
        setUser(restoredUser);
        const token = typeof window !== "undefined" ? localStorage.getItem("salonbook_token") : null;
        if (token) {
          try {
            const res = await authApi.getMe();
            if (res.data?.success && res.data?.data) {
              setUser(res.data.data);
              if (typeof window !== "undefined") {
                localStorage.setItem("salonbook_user", JSON.stringify(res.data.data));
              }
            }
          } catch {}
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    const normalized = email.trim().toLowerCase();

    try {
      // 1. Try real server authentication
      const res = await authApi.login({
        email: normalized,
        password: password || "Admin123!",
      });

      if (res.data?.success && res.data?.data) {
        const { token, user: loggedUser } = res.data.data;
        setUser(loggedUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("salonbook_token", token);
          localStorage.setItem("salonbook_user", JSON.stringify(loggedUser));
        }
        setIsLoading(false);
        toast.success(`Welcome back, ${loggedUser.name}!`);
        return true;
      }
    } catch (apiErr: unknown) {
      const errRes = (apiErr as { response?: { status?: number; data?: { message?: string } }; message?: string });
      console.warn("[Auth] Server login response:", errRes?.response?.data?.message || errRes.message);

      // If blocked user returned from server
      if (errRes?.response?.status === 403) {
        setIsLoading(false);
        toast.error(errRes.response.data?.message || "Account suspended.");
        return false;
      }

      // Check if server is simply offline/disconnected and fallback gracefully
      if (!errRes?.response) {
        console.info("[Auth] Server offline, using local fallback credentials");
      } else if (errRes.response.status === 401) {
        setIsLoading(false);
        toast.error(errRes.response.data?.message || "Invalid email or password.");
        return false;
      }
    }

    // Fallback if server is not reachable
    if (normalized.includes("admin")) {
      const admin = MOCK_USERS[0];
      setUser(admin);
      try {
        localStorage.setItem("salonbook_user", JSON.stringify(admin));
      } catch {}
      setIsLoading(false);
      toast.success(`Welcome back, ${admin.name} (Admin)!`);
      return true;
    }

    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === normalized);
    const loggedUser = found || {
      id: `usr-${Date.now()}`,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: "customer" as UserRole,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
      createdAt: new Date().toISOString(),
    };

    if (loggedUser.isBlocked) {
      setIsLoading(false);
      toast.error("Your account has been suspended. Please contact salon support.");
      return false;
    }

    setUser(loggedUser);
    try {
      localStorage.setItem("salonbook_user", JSON.stringify(loggedUser));
    } catch {}
    setIsLoading(false);
    toast.success(`Welcome back, ${loggedUser.name}!`);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      toast.loading("Opening Google Account Selector...", { id: "google-signin" });
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      });

      if (res?.error) {
        toast.dismiss("google-signin");
        toast.error(res.error.message || "Failed to start Google sign in.");
        setIsLoading(false);
        return false;
      }

      if (res?.data?.url) {
        toast.dismiss("google-signin");
        window.location.href = res.data.url;
        return true;
      }
    } catch (err: unknown) {
      toast.dismiss("google-signin");
      console.error("[Better Auth] Google sign in error:", err);
      toast.error("Google sign in encountered an error. Please try again.");
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return true;
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password?: string;
    image?: string;
    phone?: string;
  }): Promise<boolean> => {
    setIsLoading(true);

    try {
      const res = await authApi.register({
        name: userData.name,
        email: userData.email,
        password: userData.password || "Customer123!",
        image: userData.image,
        phone: userData.phone,
      });

      if (res.data?.success && res.data?.data) {
        const { token, user: newUser } = res.data.data;
        setUser(newUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("salonbook_token", token);
          localStorage.setItem("salonbook_user", JSON.stringify(newUser));
        }
        setIsLoading(false);
        toast.success("Account created successfully! Welcome to SalonBook.");
        return true;
      }
    } catch (apiErr: unknown) {
      const errRes = (apiErr as { response?: { data?: { message?: string } } });
      if (errRes?.response?.data?.message) {
        setIsLoading(false);
        toast.error(errRes.response.data.message);
        return false;
      }
    }

    // Local fallback if offline
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: "customer",
      image:
        userData.image ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
      phone: userData.phone || "+1 (555) 000-0000",
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    try {
      localStorage.setItem("salonbook_user", JSON.stringify(newUser));
    } catch {}
    setIsLoading(false);
    toast.success("Account created successfully! Welcome to SalonBook.");
    return true;
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch {}
    setUser(null);
    try {
      localStorage.removeItem("salonbook_token");
      localStorage.removeItem("salonbook_user");
    } catch {}
    toast.success("Signed out successfully.");
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    // Ensure the token in localStorage matches the active user (especially for Admin)
    if (typeof window !== "undefined") {
      try {
        if (user.role === "admin" || user.email === "admin@salonbook.com") {
          const loginRes = await authApi.login({
            email: "admin@salonbook.com",
            password: "Admin123!",
          });
          if (loginRes.data?.success && loginRes.data?.data?.token) {
            localStorage.setItem("salonbook_token", loginRes.data.data.token);
          }
        } else if (!localStorage.getItem("salonbook_token") && user.email) {
          const syncRes = await authApi.googleAuth({
            email: user.email,
            name: user.name,
            image: user.image,
          });
          if (syncRes.data?.success && syncRes.data?.data?.token) {
            localStorage.setItem("salonbook_token", syncRes.data.data.token);
          }
        }
      } catch (err) {
        console.warn("[Auth] Token preparation error:", err);
      }
    }

    try {
      const res = await authApi.updateProfile({
        name: data.name,
        phone: data.phone,
        address: data.address,
        image: data.image,
      });
      if (res.data?.success && res.data?.data) {
        const updated = res.data.data;
        setUser(updated);
        if (typeof window !== "undefined") {
          localStorage.setItem("salonbook_user", JSON.stringify(updated));
          if (updated.role === "admin") {
            localStorage.setItem("salonbook_saved_admin", JSON.stringify(updated));
          } else {
            localStorage.setItem("salonbook_saved_customer", JSON.stringify(updated));
          }
        }
        toast.success("Profile updated successfully!");
        return true;
      }
    } catch (err: unknown) {
      const errRes = (err as { response?: { data?: { message?: string } } });
      const errMsg = errRes?.response?.data?.message || "Failed to update profile on server.";
      console.error("[Auth] Profile update error:", errMsg);
      toast.error(errMsg);
      return false;
    }

    return false;
  };

  const switchRolePreview = (target: UserRole | "guest") => {
    if (target === "guest") {
      setUser(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("salonbook_user");
          localStorage.removeItem("salonbook_token");
        } catch {}
      }
      toast("Browsing as Guest visitor");
      return;
    }

    if (target === "admin") {
      // 1. Instant optimistic update (0ms perceived latency)
      let initialAdmin = MOCK_USERS[0];
      let initialAdminToken: string | null = null;
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("salonbook_saved_admin");
          if (cached) initialAdmin = JSON.parse(cached);
          initialAdminToken = localStorage.getItem("salonbook_saved_admin_token");
        } catch {}
      }

      setUser(initialAdmin);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("salonbook_user", JSON.stringify(initialAdmin));
          if (initialAdminToken) localStorage.setItem("salonbook_token", initialAdminToken);
        } catch {}
      }
      toast.success(`Switched role to Admin (${initialAdmin.name})`);

      // 2. Asynchronous background sync to verify token & freshest data from server
      authApi.login({
        email: "admin@salonbook.com",
        password: "Admin123!",
      })
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            const { token, user: adminUser } = res.data.data;
            setUser(adminUser);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem("salonbook_token", token);
                localStorage.setItem("salonbook_user", JSON.stringify(adminUser));
                localStorage.setItem("salonbook_saved_admin", JSON.stringify(adminUser));
                localStorage.setItem("salonbook_saved_admin_token", token);
              } catch {}
            }
          }
        })
        .catch(() => {});
      return;
    }

    if (target === "customer") {
      // 1. Instant optimistic update (0ms perceived latency)
      // Check if user has their own Google/Customer account cached
      let initialCustomer = MOCK_USERS[1];
      let initialCustomerToken: string | null = null;
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("salonbook_saved_customer");
          if (cached) initialCustomer = JSON.parse(cached);
          initialCustomerToken = localStorage.getItem("salonbook_saved_customer_token");
        } catch {}
      }

      setUser(initialCustomer);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("salonbook_user", JSON.stringify(initialCustomer));
          if (initialCustomerToken) localStorage.setItem("salonbook_token", initialCustomerToken);
        } catch {}
      }
      toast.success(`Switched role to Customer (${initialCustomer.name})`);

      // 2. Asynchronous background sync
      (async () => {
        try {
          const sessionRes = await authClient.getSession();
          if (sessionRes?.data?.user) {
            const u = sessionRes.data.user;
            const backendRes = await authApi.googleAuth({
              email: u.email,
              name: u.name || undefined,
              image: u.image || undefined,
            });
            if (backendRes.data?.success && backendRes.data?.data) {
              const { token, user: myUser } = backendRes.data.data;
              setUser(myUser);
              if (typeof window !== "undefined") {
                try {
                  localStorage.setItem("salonbook_token", token);
                  localStorage.setItem("salonbook_user", JSON.stringify(myUser));
                  localStorage.setItem("salonbook_saved_customer", JSON.stringify(myUser));
                  localStorage.setItem("salonbook_saved_customer_token", token);
                } catch {}
              }
              return;
            }
          }
        } catch {}

        // If no active Google session, sync demo customer credentials
        try {
          const res = await authApi.login({
            email: "demo@example.com",
            password: "Customer123!",
          });
          if (res.data?.success && res.data?.data) {
            const { token, user: custUser } = res.data.data;
            setUser(custUser);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem("salonbook_token", token);
                localStorage.setItem("salonbook_user", JSON.stringify(custUser));
                localStorage.setItem("salonbook_saved_customer", JSON.stringify(custUser));
                localStorage.setItem("salonbook_saved_customer_token", token);
              } catch {}
            }
          }
        } catch {}
      })();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isCustomer: user?.role === "customer",
        isLoading,
        login,
        loginWithGoogle,
        signup,
        logout,
        updateProfile,
        switchRolePreview,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
