"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/auth-context";
import { uploadImageToImgBB } from "@/services/upload";
import {
  Scissors,
  Mail,
  Lock,
  User,
  Image as ImageIcon,
  Phone,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  UploadCloud,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation criteria according to PDF requirements:
  // - Minimum 6 characters
  // - One uppercase letter
  // - One lowercase letter
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploadingImage(true);
      toast.loading("Uploading avatar to ImgBB...", { id: "reg-img" });
      const uploadedUrl = await uploadImageToImgBB(file);
      setImageUrl(uploadedUrl);
      toast.success("Avatar uploaded successfully!", { id: "reg-img" });
    } catch {
      toast.dismiss("reg-img");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!isPasswordValid) {
      toast.error("Please meet all password requirements before continuing.");
      return;
    }

    setIsSubmitting(true);
    const success = await signup({
      name,
      email,
      phone,
      image: imageUrl || imagePreview || undefined,
    });
    setIsSubmitting(false);

    if (success) {
      router.push("/dashboard/customer");
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    await loginWithGoogle();
    // Do not call router.push here; Better Auth redirects browser to Google Account Selector
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-16 px-4 bg-stone-50/50">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Scissors className="w-6 h-6 -rotate-45" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Create Customer Account
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light">
            Join SalonBook to schedule luxury treatments and manage bookings
          </p>
        </div>

        {/* Security Notice from PDF */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-stone-600">
            <strong>Security Notice:</strong> All public registrations create Customer
            accounts. Admin privileges are assigned by system security managers.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Demo Customer"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. demo@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
            />
          </div>

          {/* Phone (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Contact Phone</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
            />
          </div>

          {/* Profile Image (Upload or URL) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>Profile Image (Upload Image / Image URL)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="Paste image URL (https://...)"
                className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <label className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 text-xs font-medium cursor-pointer flex items-center gap-1.5 shrink-0">
                <UploadCloud className="w-4 h-4 text-stone-600" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {imagePreview && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-10 h-10 rounded-full object-cover border border-amber-400"
                />
                <span className="text-xs text-stone-500">Avatar ready</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
            />

            {/* Password Rules Checklist */}
            <div className="mt-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
              <p className="font-semibold text-stone-700 text-[11px] uppercase tracking-wide">
                Password Requirements:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span
                  className={`flex items-center gap-1 font-medium ${
                    hasMinLength ? "text-emerald-700" : "text-stone-400"
                  }`}
                >
                  {hasMinLength ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  Min 6 characters
                </span>
                <span
                  className={`flex items-center gap-1 font-medium ${
                    hasUppercase ? "text-emerald-700" : "text-stone-400"
                  }`}
                >
                  {hasUppercase ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  One uppercase
                </span>
                <span
                  className={`flex items-center gap-1 font-medium ${
                    hasLowercase ? "text-emerald-700" : "text-stone-400"
                  }`}
                >
                  {hasLowercase ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  One lowercase
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isPasswordValid}
            className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-semibold text-sm transition shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {isSubmitting ? (
              <span>Creating your account...</span>
            ) : (
              <>
                <span>Complete Customer Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-white px-3 text-stone-400">or sign up with</span>
          </div>
        </div>

        {/* Google Authentication */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium text-sm transition flex items-center justify-center gap-3 active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Register with Google Account</span>
        </button>

        <div className="text-center text-xs text-stone-500">
          Already registered with SalonBook?{" "}
          <Link href="/login" className="text-amber-700 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
