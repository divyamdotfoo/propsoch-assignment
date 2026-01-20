export function CardSkeleton() {
  return (
    <article className="group">
      {/* Image Container Skeleton */}
      <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100 animate-pulse">
        {/* Wishlist Button Skeleton */}
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm" />

        {/* Listing Type Badge Skeleton */}
        <div className="absolute top-3 left-3">
          <div className="w-16 h-6 rounded-full bg-white/90 backdrop-blur-sm" />
        </div>

        {/* PropScore Badge Skeleton */}
        <div className="absolute bottom-3 left-3">
          <div className="w-12 h-6 rounded-md bg-gray-200/60" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="mt-3 space-y-2">
        {/* Title Skeleton */}
        <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />

        {/* Location Skeleton */}
        <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />

        {/* Typologies & Area Skeleton */}
        <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />

        {/* Price and Possession Skeleton */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 bg-gray-100 rounded animate-pulse w-1/3" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-1/4" />
        </div>
      </div>
    </article>
  );
}

export function ListingsGridSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Header Skeleton */}
      <div className="px-6 py-4">
        <div className="h-6 bg-gray-100 rounded animate-pulse w-48 mb-2" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
      </div>

      {/* Grid Skeleton */}
      <div className="px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="w-full h-full bg-gray-50 rounded-3xl overflow-hidden animate-pulse">
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          {/* Map Icon Skeleton */}
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full" />

          {/* Text Skeletons */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-100 rounded w-32 mx-auto" />
            <div className="h-4 bg-gray-100 rounded w-48 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
