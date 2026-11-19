import React from "react";
import Link from "next/link";
import { SalonService } from "../types";
import { Clock, ArrowRight, Star } from "lucide-react";

interface ServiceCardProps {
  service: SalonService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image container */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-150">
        <img
          src={service.image}
          alt={service.serviceName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-white/95 text-stone-800 shadow-sm backdrop-blur-xs">
            {service.category}
          </span>
        </div>

        {/* Rating if available */}
        {service.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-900/80 text-amber-300 backdrop-blur-xs">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{service.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xl font-bold font-serif text-white drop-shadow-md">
            ${service.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{service.duration} mins session</span>
          </div>

          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1 mb-2">
            {service.serviceName}
          </h3>

          <p className="text-stone-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {service.description}
          </p>
        </div>

        {/* Card Footer / View Details */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">
            {service.status === "active" ? (
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Available Today
              </span>
            ) : (
              <span className="text-stone-400">Unavailable</span>
            )}
          </span>

          <Link
            href={`/services/${service.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-stone-900 text-white hover:bg-amber-600 transition-colors active:scale-95 shadow-xs"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
