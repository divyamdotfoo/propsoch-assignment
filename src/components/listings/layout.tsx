import { Listing } from "@/types/listing";
import { ListingCard } from "@/components/listings/card";

export type ListingsGridProps = {
  listings: Listing[];
  totalCount?: number;
};

export function ListingsGrid({ listings, totalCount }: ListingsGridProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {totalCount !== undefined
            ? `${totalCount.toLocaleString()} listings available`
            : `${listings.length} listings`}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">in Bengaluru</p>
      </div>

      {/* Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* Empty State */}
        {listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-300 mb-4"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">
              No listings found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
