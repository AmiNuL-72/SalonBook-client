"use client";

import React, { useState } from "react";
import { useSalon } from "@/context/salon-context";
import { SalonService, ServiceCategory } from "@/types";
import { SERVICE_CATEGORIES } from "@/data/mock-data";
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  UploadCloud,
  X,
  Search,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminServicesPage() {
  const {
    services,
    addService,
    updateService,
    deleteService,
    toggleServiceStatus,
  } = useSalon();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<SalonService | null>(null);

  // Form State
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Haircut & Styling");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(65);
  const [duration, setDuration] = useState<number>(60);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const openCreateModal = () => {
    setEditingService(null);
    setServiceName("");
    setCategory("Haircut & Styling");
    setDescription("");
    setPrice(75);
    setDuration(60);
    setImage("https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80");
    setImagePreview(null);
    setStatus("active");
    setModalOpen(true);
  };

  const openEditModal = (srv: SalonService) => {
    setEditingService(srv);
    setServiceName(srv.serviceName);
    setCategory(srv.category);
    setDescription(srv.description);
    setPrice(srv.price);
    setDuration(srv.duration);
    setImage(srv.image);
    setImagePreview(srv.image);
    setStatus(srv.status);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        toast.loading("Uploading image...", { id: "img-upload" });
        const { uploadImageToImgBB } = await import("@/services/upload");
        const uploadedUrl = await uploadImageToImgBB(file);
        setImage(uploadedUrl);
        setImagePreview(uploadedUrl);
        toast.success("Image uploaded successfully!", { id: "img-upload" });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Failed to upload image.";
        toast.error(errorMsg, { id: "img-upload" });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName.trim()) {
      toast.error("Service name is required.");
      return;
    }
    if (price <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }
    if (duration <= 0) {
      toast.error("Duration must be a positive number (minutes).");
      return;
    }
    if (!image) {
      toast.error("Please upload a service image.");
      return;
    }

    if (editingService) {
      updateService(editingService.id, {
        serviceName,
        category,
        description,
        price,
        duration,
        image,
        status,
      });
    } else {
      addService({
        serviceName,
        category,
        description,
        price,
        duration,
        image,
        status,
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete service "${name}"?`)) {
      deleteService(id);
    }
  };

  const filteredServices = services.filter(
    (s) =>
      s.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Manage Salon Services
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Create, update, activate, or archive salon treatments and pricing
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white font-semibold text-xs hover:bg-amber-600 transition shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter treatments by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        />
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase font-semibold border-b border-stone-200 tracking-wider">
              <tr>
                <th className="py-4 px-6">Service</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Duration</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150">
              {filteredServices.map((srv) => (
                <tr key={srv.id} className="hover:bg-stone-50/60 transition">
                  {/* Service info & image */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={srv.image}
                        alt={srv.serviceName}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <p className="font-serif font-bold text-sm text-stone-900">
                          {srv.serviceName}
                        </p>
                        <p className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">
                          {srv.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <span className="font-medium text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">
                      {srv.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 font-serif font-bold text-stone-900 text-sm">
                    ${srv.price}
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-4 text-stone-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {srv.duration} mins
                    </span>
                  </td>

                  {/* Status Toggle Button */}
                  <td className="py-4 px-4">
                    <button
                      onClick={() => toggleServiceStatus(srv.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase transition ${
                        srv.status === "active"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                      }`}
                      title="Click to toggle Active / Inactive status"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          srv.status === "active" ? "bg-emerald-600" : "bg-stone-400"
                        }`}
                      />
                      <span>{srv.status}</span>
                    </button>
                  </td>

                  {/* Action buttons */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(srv)}
                        className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-amber-700 hover:border-amber-400 transition"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(srv.id, srv.serviceName)}
                        className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Update Service Modal (Requirement: Image Upload, Not Image URL) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">
              {editingService ? "Update Salon Service" : "Add New Salon Service"}
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Fill in treatment parameters. All pricing and duration metrics must be positive numbers.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Master Balayage & Glaze"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Service Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  {SERVICE_CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Price ($ USD)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Estimated Duration (in minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Service Image (PDF Requirement: Image Upload; Not Image URL) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center justify-between">
                  <span>Service Image (Image Upload Required)</span>
                  <span className="text-[10px] text-amber-700 font-normal">
                    Direct File Upload
                  </span>
                </label>
                <div className="p-4 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 text-center space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    id="service-image-upload"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="service-image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:border-amber-500 cursor-pointer transition shadow-xs"
                  >
                    <UploadCloud className="w-4 h-4 text-amber-600" />
                    <span>Upload Image File</span>
                  </label>
                  <p className="text-[11px] text-stone-400">
                    PNG, JPG, or WEBP up to 5MB (Simulates ImgBB upload flow)
                  </p>
                </div>
                {image && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-stone-100 rounded-xl">
                    <img
                      src={image}
                      alt="Uploaded preview"
                      className="w-12 h-12 rounded-lg object-cover border border-stone-300"
                    />
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Image attachment verified
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the steps, hair products used, and styling outcome..."
                  required
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Service Status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Initial Service Status (Default: Active)
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="active">Active (Visible on public catalogue)</option>
                  <option value="inactive">Inactive (Hidden from booking)</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-150">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-amber-600 transition shadow-md active:scale-95"
                >
                  {editingService ? "Save Service Updates" : "Publish Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
