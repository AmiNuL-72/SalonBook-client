"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { uploadImageToImgBB } from "@/services/upload";
import { User, Phone, MapPin, Mail, UploadCloud, ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProfilePage() {
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

    // Upload to ImgBB for lightweight hosting
    try {
      setIsUploading(true);
      toast.loading("Uploading photo to ImgBB...", { id: "img-upload" });
      const uploadedUrl = await uploadImageToImgBB(file);
      setImageUrl(uploadedUrl);
      toast.success("Photo uploaded successfully!", { id: "img-upload" });
    } catch (err: unknown) {
      console.warn("[Upload] ImgBB upload fallback:", err);
      toast.dismiss("img-upload");
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
          Admin Profile Settings
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">
          Manage administrative personnel profile, direct communication phone, and display credentials
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Avatar & Role Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-stone-150">
          <img
            src={
              imagePreview ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            }
            alt={user?.name || "Admin Avatar"}
            className="w-24 h-24 rounded-full object-cover border-2 border-purple-500 shadow-md"
          />

          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-serif font-bold text-stone-900">{user?.name}</h3>
            <p className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>{user?.email}</span>
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Salon Administrator
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Full Privileges
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
              <span>Administrator Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>Administrator Email</span>
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-sm text-stone-500 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Direct Phone</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 234-5678"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Salon Location / Office Address</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="742 Evergreen Terrace, Suite 101, New York, NY"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-stone-900"
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Profile Image (Upload Image / Image URL)</span>
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
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(isSaving || isUploading) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isUploading ? "Uploading Image..." : isSaving ? "Saving..." : "Save Admin Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
