"use client";

import { Listing } from "@/types/listing";
import {
  formatPrice,
  formatDate,
  concatenateTypologies,
} from "@/utils/helpers";
import Image from "next/image";
import { Pagination, PaginationInfo } from "./ui/pagination";
import { useListings } from "@/contexts/listings";
import { CardSkeleton } from "./card-skeleton";

type ListingsGridProps = {
  totalCount?: number;
};

const ITEMS_PER_PAGE = 10;

export function ListingsGrid({ totalCount }: ListingsGridProps) {
  const { listingsState, isLoading, setPage } = useListings();
  const { listings, totalPages, currentPage, totalListings } = listingsState;

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isLoading
                ? "Searching..."
                : totalListings > 0
                  ? `${totalListings.toLocaleString()} listings within map area`
                  : "No listings found"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">in Bengaluru</p>
          </div>
          {!isLoading && totalListings > 0 && (
            <PaginationInfo
              currentPage={currentPage}
              pageSize={ITEMS_PER_PAGE}
              totalCount={totalListings}
            />
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 py-6">
        {isLoading ? (
          // Show skeletons during loading
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length > 0 ? (
          // Show listings
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gray-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <path d="M8 11h6" />
              </svg>
            </div>
            <p className="text-gray-900 text-lg font-semibold">
              Oops! No matches found
            </p>
            <p className="text-gray-500 text-sm mt-1 text-center max-w-sm">
              We couldn&apos;t find any listings matching your criteria. Try
              adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="px-6 py-8 border-t border-gray-200 mb-20 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

type ListingCardProps = {
  listing: Listing;
};

function ListingCard({ listing }: ListingCardProps) {
  const {
    name,
    image,
    alt,
    micromarket,
    city,
    minPrice,
    maxPrice,
    typologies,
    minSaleableArea,
    maxSaleableArea,
    possessionDate,
    propscore,
    type,
  } = listing;

  const priceRange =
    minPrice === maxPrice
      ? `₹${formatPrice(minPrice, false)}`
      : `₹${formatPrice(minPrice, false)} - ₹${formatPrice(maxPrice, false)}`;

  const areaRange =
    minSaleableArea === maxSaleableArea
      ? `${minSaleableArea} sq.ft`
      : `${minSaleableArea} - ${maxSaleableArea} sq.ft`;

  return (
    <article className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          aria-label="Add to wishlist"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Listing Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800">
            {type}
          </span>
        </div>

        {/* PropScore Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {propscore.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 space-y-1">
        {/* Title and Location */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{name}</h3>
        </div>

        <p className="text-sm text-gray-600">
          {micromarket}, {city}
        </p>

        {/* Typologies & Area */}
        <p className="text-sm text-gray-500">
          {concatenateTypologies(typologies)} · {areaRange}
        </p>

        {/* Price and Possession */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-semibold text-gray-900">{priceRange}</span>
          <span className="text-sm text-gray-500">
            {formatDate(possessionDate)}
          </span>
        </div>
      </div>
    </article>
  );
}
