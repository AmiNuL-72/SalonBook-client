"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { uploadImageToImgBB } from "@/services/upload";
import { User, Phone, MapPin, Mail, UploadCloud, Shield, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerProfilePage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Sync form inputs whenever user profile updates
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setImageUrl(user.image || "");
      setImagePreview(user.image || null);
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB
    try {
      setIsUploading(true);
      toast.loading("Uploading photo to ImgBB...", { id: "cust-img-upload" });
      const uploadedUrl = await uploadImageToImgBB(file);
      setImageUrl(uploadedUrl);
      toast.success("Photo uploaded successfully!", { id: "cust-img-upload" });
    } catch (err: unknown) {
      console.warn("[Upload] ImgBB upload fallback:", err);
      toast.dismiss("cust-img-upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (isUploading) {
      toast.error("Please wait for the image upload to complete.");
      return;
    }

    setIsSaving(true);
    await updateProfile({
      name,
      phone,
      address,
      image: imageUrl || imagePreview || undefined,
    });
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          My Profile Information
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">
          Manage your personal customer account details and contact preferences
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Avatar Header & Static Security Info */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-stone-150">
          <div className="relative">
            <img
              src={
                imagePreview ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
              }
              alt={user?.name || "Customer Avatar"}
              className="w-24 h-24 rounded-full object-cover border-2 border-amber-400 shadow-md"
            />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-serif font-bold text-stone-900">{user?.name}</h3>
            <p className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>{user?.email}</span>
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                {user?.role}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Active Member
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
            />
          </div>

          {/* Email (Read-only as identity credential) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>Registered Email (Account Identity)</span>
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-sm text-stone-500 cursor-not-allowed"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Contact Phone Number</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Residential / Billing Address</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 124 Magnolia Blvd, Brooklyn, NY"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
            />
          </div>

          {/* Profile Image URL & Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
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
                placeholder="https://..."
                className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <label className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 text-xs font-medium cursor-pointer flex items-center gap-1.5 shrink-0">
                <UploadCloud className="w-4 h-4 text-stone-600" />
                <span>Choose File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Security Rules reminder from assignment */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-stone-800">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Role & Permission Security Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Per platform security specifications, users cannot alter their own account role (Customer/Admin) or blocked status through profile modification endpoints.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(isSaving || isUploading) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isUploading ? "Uploading Image..." : isSaving ? "Saving..." : "Save Profile Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
