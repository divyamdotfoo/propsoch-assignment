"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Home,
  IndianRupee,
  X,
  Building2,
  Trees,
  LayoutGrid,
  Warehouse,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { formatPrice } from "@/utils/helpers";
import { useListings } from "@/contexts/listings";
import Link from "next/link";

type NavbarProps = {
  listingTypes: string[];
  micromarkets: string[];
  priceRange: { min: number; max: number };
};

const LISTING_TYPE_ICONS: Record<string, typeof Building2> = {
  Apartment: Building2,
  Villa: Trees,
  Plot: LayoutGrid,
  "Row House": Warehouse,
};

export function Navbar({
  listingTypes,
  micromarkets,
  priceRange,
}: NavbarProps) {
  const { filters, setFilters, clearFilters, isLoading } = useListings();

  // Local state for search input (for debounce) - initialized from URL filters
  const [searchValue, setSearchValue] = useState(filters.name || "");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Local state for price slider - initialized from URL filters
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    filters.minPrice ?? priceRange.min,
    filters.maxPrice ?? priceRange.max,
  ]);

  // Handle debounced search (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setFilters({ name: searchValue || null });
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue, setFilters]);

  const handleLocationSelect = (area: string | null) => {
    setFilters({ micromarket: area });
  };

  const handleTypeSelect = (type: string) => {
    // Toggle: if already selected, deselect
    if (filters.type === type) {
      setFilters({ type: null });
    } else {
      setFilters({ type });
    }
  };

  const handlePriceApply = () => {
    setFilters({
      minPrice: localPriceRange[0],
      maxPrice: localPriceRange[1],
    });
  };

  const handleClearPriceFilter = () => {
    setLocalPriceRange([priceRange.min, priceRange.max]);
    setFilters({ minPrice: null, maxPrice: null });
  };

  const selectedLocation = filters.micromarket || "All Areas";
  const hasPriceFilter = filters.minPrice !== null || filters.maxPrice !== null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="flex items-center gap-6 px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            PlotPirate
          </span>
        </Link>

        {/* Center Search Bar */}
        <div className="flex-1 flex items-center gap-4">
          {/* Location Dropdown */}
          <LocationSelect
            micromarkets={micromarkets}
            selectedLocation={selectedLocation}
            isSelected={!!filters.micromarket}
            onLocationSelect={handleLocationSelect}
          />

          {/* Listing Type Pills */}
          <div className="flex items-center gap-2">
            {listingTypes.slice(0, 4).map((type) => {
              const Icon = LISTING_TYPE_ICONS[type] || Building2;
              const isSelected = filters.type === type;
              return (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {type}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 focus-within:border-gray-300 transition-colors">
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-gray-400" />
            )}
            <input
              type="text"
              placeholder="Search by project name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section - Budget Filter */}
        <div className="shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-colors cursor-pointer ${
                  hasPriceFilter
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "border-gray-200 hover:border-gray-400 text-gray-700"
                }`}
              >
                <IndianRupee className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {hasPriceFilter
                    ? `₹${formatPrice(filters.minPrice || priceRange.min, false)} - ₹${formatPrice(filters.maxPrice || priceRange.max, false)}`
                    : "Budget"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Price Range
                  </h3>
                  <PopoverClose asChild>
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </PopoverClose>
                </div>

                {/* Price Labels */}
                <div className="flex justify-between text-sm font-semibold text-gray-900">
                  <span>₹{formatPrice(localPriceRange[0], false)}</span>
                  <span>₹{formatPrice(localPriceRange[1], false)}</span>
                </div>

                {/* Slider */}
                <Slider
                  value={localPriceRange}
                  onValueChange={(value) =>
                    setLocalPriceRange(value as [number, number])
                  }
                  min={priceRange.min}
                  max={priceRange.max}
                  step={1000000}
                />

                {/* Buttons */}
                <div className="flex gap-2">
                  {hasPriceFilter && (
                    <PopoverClose asChild>
                      <Button
                        variant="secondary"
                        size="medium"
                        onClick={handleClearPriceFilter}
                        className="flex-1"
                      >
                        Clear
                      </Button>
                    </PopoverClose>
                  )}
                  <PopoverClose asChild>
                    <Button
                      variant="primary"
                      size="medium"
                      onClick={handlePriceApply}
                      className="flex-1"
                    >
                      Apply
                    </Button>
                  </PopoverClose>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear All Filters Button (only show if any filter is active) */}
        {(filters.micromarket ||
          filters.type ||
          filters.name ||
          hasPriceFilter) && (
          <button
            onClick={() => {
              clearFilters();
              setSearchValue("");
              setLocalPriceRange([priceRange.min, priceRange.max]);
            }}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 underline underline-offset-2 shrink-0"
          >
            Clear all
          </button>
        )}
      </div>
    </header>
  );
}

// Location Select Component
type LocationSelectProps = {
  micromarkets: string[];
  selectedLocation: string;
  isSelected: boolean;
  onLocationSelect: (area: string | null) => void;
};

function LocationSelect({
  micromarkets,
  selectedLocation,
  isSelected,
  onLocationSelect,
}: LocationSelectProps) {
  return (
    <Select
      value={selectedLocation === "All Areas" ? "all" : selectedLocation}
      onValueChange={(value) => {
        if (value === "all") {
          onLocationSelect(null);
        } else {
          onLocationSelect(value);
        }
      }}
    >
      <SelectTrigger
        hideIcon
        className={`gap-2 px-4 py-2.5 rounded-full h-auto cursor-pointer ${
          isSelected
            ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            : "bg-gray-50 hover:bg-gray-100 border-gray-200"
        }`}
      >
        <MapPin
          className={`w-4 h-4 shrink-0 ${
            isSelected ? "text-emerald-600" : "text-gray-600"
          }`}
        />
        <div className="flex flex-col items-start gap-0">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide leading-none">
            Location
          </span>
          <span
            className={`text-sm font-semibold leading-tight ${
              isSelected ? "text-emerald-700" : "text-gray-900"
            }`}
          >
            <SelectValue />
          </span>
        </div>
      </SelectTrigger>
      <SelectContent
        className="w-56 rounded-xl border-gray-100 shadow-lg p-2 max-h-96 overflow-y-auto"
        align="start"
        position="popper"
        sideOffset={8}
      >
        <SelectItem
          value="all"
          hideIndicator
          className={`px-4 py-2.5 rounded-md ${
            !isSelected
              ? "text-emerald-600 font-semibold bg-emerald-50 hover:bg-emerald-50 focus:bg-emerald-50"
              : "text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
          }`}
        >
          All Areas
        </SelectItem>
        {micromarkets.map((area) => (
          <SelectItem
            key={area}
            value={area}
            hideIndicator
            className={`px-4 py-2.5 rounded-md ${
              selectedLocation === area
                ? "text-emerald-600 font-semibold bg-emerald-50 hover:bg-emerald-50 focus:bg-emerald-50"
                : "text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
            }`}
          >
            {area}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
