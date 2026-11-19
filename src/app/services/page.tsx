"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSalon } from "../../context/salon-context";
import ServiceCard from "../../components/service-card";
import { SERVICE_CATEGORIES } from "../../data/mock-data";
import { ServiceCategory } from "../../types";
import {
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
  Scissors,
} from "lucide-react";

function BrowseServicesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const { activeServices } = useSalon();

  // Search, Filter, Sort states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "All"
  );
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  // Filtering & Sorting logic
  const filteredServices = useMemo(() => {
    let result = [...activeServices];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.serviceName.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // Sort by Price
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeServices, searchQuery, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("default");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedCategory !== "All" || sortBy !== "default";

  return (
    <div className="min-h-screen bg-stone-50/60 pb-24">
      {/* Page Header */}
      <div className="bg-stone-900 text-white py-14 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Salon Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Browse Salon Services
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-2xl font-light">
            Discover our comprehensive menu of haircuts, styling, hair treatments, facials,
            manicures, and holistic wellness rituals.
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Category Filter, and Price Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services by name or treatment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            {/* Category Dropdown (Mobile/Quick select) */}
            <div className="md:col-span-3 relative">
              <Filter className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by Category"
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition appearance-none cursor-pointer"
              >
                <option value="All">All Categories ({activeServices.length})</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Sort Dropdown */}
            <div className="md:col-span-3 relative">
              <ArrowUpDown className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "default" | "price-asc" | "price-desc")
                }
                aria-label="Sort by Price"
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition appearance-none cursor-pointer"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-asc">Price: Low to High ($ → $$$)</option>
                <option value="price-desc">Price: High to Low ($$$ → $)</option>
              </select>
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === "All"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              All
            </button>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.name
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services List Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Results stats & clear filter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Showing <strong className="text-stone-900">{filteredServices.length}</strong> active salon {filteredServices.length === 1 ? "service" : "services"}
          </p>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              No services match your filters
            </h3>
            <p className="text-sm text-stone-500 mb-6">
              Try searching with different keywords or clearing your category and price filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-12 text-center text-xs text-stone-400">Loading salon services...</div>}>
      <BrowseServicesContent />
    </Suspense>
  );
}
