"use client";

import dynamic from "next/dynamic";
import { useListings } from "@/contexts/listings";

const DiscoveryMap = dynamic(
  () => import("./discovery-map").then((mod) => mod.DiscoveryMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Loading map...</span>
        </div>
      </div>
    ),
  }
);

export default function DiscoveryMapWrapper() {
  const { mapListings, setMapBounds, isMapLoading, initialBounds } =
    useListings();

  return (
    <DiscoveryMap
      listings={mapListings}
      onBoundsChange={setMapBounds}
      isLoading={isMapLoading}
      initialBounds={initialBounds}
    />
  );
}
