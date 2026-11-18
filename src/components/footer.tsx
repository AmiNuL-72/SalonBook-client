"use client";

import React from "react";
import Link from "next/link";
import {
  Scissors,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Globe,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800/80">
          {/* Col 1: Logo & Short Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold text-white tracking-tight">
                  Salon<span className="text-amber-400">Book</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
                  Luxury & Aesthetics
                </span>
              </div>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              Premier sanctuary for tailored hair artistry, rejuvenating skincare rituals,
              and bespoke holistic beauty treatments crafted for your personal glow.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400 transition"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400 transition"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.889C10.667 0 9 1.667 9 4.667V8z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400 transition"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://salonbook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400 transition"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Important Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-white font-serif text-base tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link href="/" className="hover:text-amber-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition">
                  Client Portal Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-amber-400 transition">
                  New Member Registration
                </Link>
              </li>
              <li>
                <Link href="/services#categories" className="hover:text-amber-400 transition">
                  Service Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Salon Address and Opening Hours */}
          <div className="space-y-4">
            <h4 className="text-white font-serif text-base tracking-wide flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Hours & Location
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  742 Evergreen Terrace, Suite 101<br />
                  Manhattan, NY 10001
                </span>
              </div>
              <div className="pt-2">
                <p className="text-stone-300 font-medium text-xs uppercase tracking-wider mb-1">
                  Salon Working Hours:
                </p>
                <p className="text-xs">Mon - Fri: 9:00 AM – 8:00 PM</p>
                <p className="text-xs">Saturday: 9:00 AM – 7:00 PM</p>
                <p className="text-xs">Sunday: 10:00 AM – 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Col 4: Salon Contact Information */}
          <div className="space-y-4">
            <h4 className="text-white font-serif text-base tracking-wide flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-400" />
              Contact Concierge
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Have special questions, wedding party inquiries, or booking adjustments?
            </p>
            <div className="space-y-2 text-sm text-stone-300">
              <a
                href="tel:+15552345678"
                className="flex items-center gap-2 hover:text-amber-400 transition"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+1 (555) 234-5678</span>
              </a>
              <a
                href="mailto:concierge@salonbook.com"
                className="flex items-center gap-2 hover:text-amber-400 transition"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>concierge@salonbook.com</span>
              </a>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Appointments Open This Week
              </span>
            </div>
          </div>
        </div>

        {/* Copyright Information */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 SalonBook Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-stone-300 transition">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-stone-300 transition">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-stone-300 transition">
              Stripe Verified Payments
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
