import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "amber" | "emerald" | "blue" | "rose" | "purple";
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "amber",
}: StatsCardProps) {
  const colorStyles = {
    amber: "bg-amber-500/10 text-amber-600 border-amber-200/60",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-200/60",
    blue: "bg-sky-500/10 text-sky-600 border-sky-200/60",
    rose: "bg-rose-500/10 text-rose-600 border-rose-200/60",
    purple: "bg-purple-500/10 text-purple-600 border-purple-200/60",
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-stone-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorStyles[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
