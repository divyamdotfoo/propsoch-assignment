import { Home, Search } from "lucide-react";

export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="flex items-center gap-6 px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            PlotPirate
          </span>
        </div>

        {/* Center Search Bar Skeleton */}
        <div className="flex-1 flex items-center gap-4">
          {/* Location Skeleton */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-1">
              <div className="h-2 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Listing Type Pills Skeleton */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-20 bg-gray-100 rounded-full animate-pulse"
              />
            ))}
          </div>

          {/* Search Input Skeleton */}
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200">
            <Search className="w-4 h-4 text-gray-300" />
            <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Search Button Skeleton */}
          <div className="h-10 w-28 bg-emerald-200 rounded-full animate-pulse" />
        </div>

        {/* Right Section Skeleton */}
        <div className="shrink-0">
          <div className="h-10 w-24 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>
    </header>
  );
}
