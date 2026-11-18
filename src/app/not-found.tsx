import Link from "next/link";
import { Scissors, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-stone-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <Scissors className="w-8 h-8 -rotate-45" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-serif font-bold text-amber-600 block">
            404
          </span>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            The page or salon resource you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Salon Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
