"use client";

import React from "react";
import Link from "next/link";
import { useSalon } from "../context/salon-context";
import { SERVICE_CATEGORIES } from "../data/mock-data";
import ServiceCard from "../components/service-card";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  HeartHandshake,
  Clock,
  Star,
  Scissors,
} from "lucide-react";

export default function HomePage() {
  const { featuredServices, activeServices } = useSalon();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-stone-950 text-white">
        {/* Background Image with luxury dark gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Salon Interior"
            className="w-full h-full object-cover object-center opacity-30 scale-105 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/30" />
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-medium tracking-wide mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Elevate Your Beauty & Wellness Ritual</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-tight">
            Indulge in Master Haircare &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
              Rejuvenating Spa Artistry
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-300 font-light leading-relaxed mb-10">
            Welcome to SalonBook. Experience bespoke hair transformations, luxury hydra-facials,
            and soothing therapeutic wellness sessions curated by world-class certified stylists.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-base shadow-lg shadow-amber-500/20 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>Explore Salon Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-medium text-base backdrop-blur-xs transition active:scale-95"
            >
              Join VIP Members Club
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/10 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">4.9 / 5.0</p>
              <p className="text-xs text-stone-400 mt-1">Client Satisfaction</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">12k+</p>
              <p className="text-xs text-stone-400 mt-1">Sessions Completed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">25+</p>
              <p className="text-xs text-stone-400 mt-1">Master Artists</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">100%</p>
              <p className="text-xs text-stone-400 mt-1">Organic Products</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION 1: FEATURED SALON SERVICES */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-widest mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Handcrafted Experiences</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
                Featured Salon Services
              </h2>
              <p className="text-stone-600 text-sm mt-2 max-w-xl">
                Explore our signature salon treatments available for instant appointment reservation.
                Each session is performed with high-end cruelty-free botanicals.
              </p>
            </div>

            <Link
              href="/services"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 transition"
            >
              <span>View All Services ({activeServices.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Service Cards Grid (Minimum 6 active services) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC SECTION 2: SALON SERVICE CATEGORIES */}
      <section id="categories" className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-bold uppercase tracking-widest mb-2">
              <Scissors className="w-4 h-4" />
              <span>Full Spectrum Treatments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Salon Service Categories
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              From precision cutting and balayage to deep hydra-facials and hot stone massages,
              select a category to discover curated beauty rituals.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400 bg-stone-900 text-white h-72 flex flex-col justify-end p-6 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                <div className="relative z-10">
                  <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold mb-1 block">
                    Category
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 mt-1.5 font-light">
                    {cat.description}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore category</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ADDITIONAL SECTION: WHY CHOOSE US & LUXURY STANDARDS */}
      <section className="py-20 bg-stone-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              The SalonBook Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
              Uncompromising Standards of Luxury
            </h2>
            <p className="text-stone-400 text-sm mt-3">
              Every detail of your visit is orchestrated for serenity, privacy, and transformative aesthetic results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Master Stylists</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Trained in European, Japanese, and American fashion weeks with 8+ years average master experience.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Clean Organic Care</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                100% cruelty-free, sulfate-free, and vegan botanical formulas that nourish your scalp and natural skin barrier.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Seamless Booking</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Live scheduling, instant slot confirmation, and verified Stripe checkout with zero hidden surcharges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Bespoke Consult</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Every appointment begins with an in-depth conversation tailored to your facial geometry and personal lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-amber-700 text-xs font-bold uppercase tracking-widest">
              Verified Client Reviews
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mt-2">
              Loved by Over 12,000+ Guests
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm italic leading-relaxed mb-6">
                  &quot;The Artisan Balayage was transformative! Elena understood exactly what I wanted.
                  The online booking through SalonBook was effortless, and the private suite atmosphere was pure bliss.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-stone-100 pt-4">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="Chloe Davenport"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Chloe Davenport</h4>
                  <p className="text-[11px] text-stone-500">Balayage & Hair Treatment</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm italic leading-relaxed mb-6">
                  &quot;I booked the Diamond Glow Hydra-Derm facial before my wedding. My skin has never looked
                  so radiant and dewy. Being able to track my appointment and pay via Stripe on my phone was so convenient.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-stone-100 pt-4">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                  alt="Isabella Rodriguez"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Isabella Rodriguez</h4>
                  <p className="text-[11px] text-stone-500">Hydra-Derm Facial Client</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm italic leading-relaxed mb-6">
                  &quot;The hot stone aromatherapy session completely relieved my chronic shoulder pain.
                  The staff is punctual, courteous, and exceptionally skilled. 10/10 recommendation!&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-stone-100 pt-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Marcus Chen"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Marcus Chen</h4>
                  <p className="text-[11px] text-stone-500">Hot Stone Spa Guest</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION STRIP */}
      <section className="py-16 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            Ready for Your Next Transformation?
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
            Book online today in under two minutes. Select your favorite service, choose your preferred time slot, and let our master artists pamper you.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold transition-all shadow-lg active:scale-95"
          >
            <span>Book Your Session Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
