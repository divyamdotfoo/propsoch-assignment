"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Listing } from "@/types/listing";
import {
  FiltersState,
  DEFAULT_FILTERS,
  filtersToSearchParams,
  updateBrowserUrl,
} from "@/utils/search-params";
import { MapBounds } from "@/types/listing";

interface ListingsState {
  listings: Listing[];
  totalPages: number;
  currentPage: number;
  totalListings: number;
}

interface ListingsContextValue {
  // State
  listingsState: ListingsState;
  filters: FiltersState;
  isLoading: boolean;
  mapListings: Listing[];
  isMapLoading: boolean;
  initialBounds: MapBounds | null;

  // Actions
  setFilters: (filters: Partial<FiltersState>) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setMapBounds: (bounds: MapBounds) => void;
}

const ListingsContext = createContext<ListingsContextValue | null>(null);

interface ListingsProviderProps {
  children: ReactNode;
  initialListings: Listing[];
  initialTotalPages: number;
  initialCurrentPage: number;
  initialTotalListings: number;
  initialFilters?: FiltersState;
}

export function ListingsProvider({
  children,
  initialListings,
  initialTotalPages,
  initialCurrentPage,
  initialTotalListings,
  initialFilters,
}: ListingsProviderProps) {
  const [listingsState, setListingsState] = useState<ListingsState>({
    listings: initialListings,
    totalPages: initialTotalPages,
    currentPage: initialCurrentPage,
    totalListings: initialTotalListings,
  });

  const [filters, setFiltersState] = useState<FiltersState>(
    initialFilters || DEFAULT_FILTERS
  );
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [isLoading, setIsLoading] = useState(false);
  const [mapListings, setMapListings] = useState<Listing[]>(initialListings);
  const [isMapLoading, setIsMapLoading] = useState(false);

  // Refs to track initial mount and skip unnecessary fetches
  const isInitialMount = useRef(true);
  const skipNextFetch = useRef(!!initialFilters?.bounds);

  const initialBounds = initialFilters?.bounds || null;

  /**
   * Centralized fetch function - fetches both paginated listings and map listings
   * This is the single source of truth for all data fetching
   */
  const fetchData = async (currentFilters: FiltersState, page: number) => {
    setIsLoading(true);
    setIsMapLoading(true);

    try {
      const params = filtersToSearchParams(currentFilters, page);

      // Fetch both paginated listings and map listings in parallel
      const [listingsResponse, mapResponse] = await Promise.all([
        fetch(`/api/listings?${params.toString()}`),
        currentFilters.bounds
          ? fetch(`/api/map-listings?${params.toString()}`)
          : Promise.resolve(null),
      ]);

      const listingsData = await listingsResponse.json();

      setListingsState({
        listings: listingsData.listings,
        totalPages: listingsData.totalPages,
        currentPage: listingsData.currentPage,
        totalListings: listingsData.totalListings,
      });

      // Update map listings if we have bounds
      if (mapResponse) {
        const mapData = await mapResponse.json();
        setMapListings(mapData.listings);
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setIsLoading(false);
      setIsMapLoading(false);
    }
  };

  // Single effect to handle all data fetching when filters or page changes
  useEffect(() => {
    // Skip initial mount - we already have SSR data
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Skip fetch if this is just syncing initial bounds from URL
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    fetchData(filters, currentPage);
  }, [filters, currentPage]);

  // Sync state to browser URL
  useEffect(() => {
    updateBrowserUrl(filters, currentPage);
  }, [filters, currentPage]);

  // Action: Update filters (resets to page 1)
  const setFilters = useCallback((newFilters: Partial<FiltersState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  // Action: Clear all filters
  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, []);

  // Action: Change page
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Action: Update map bounds
  const setMapBounds = useCallback((bounds: MapBounds) => {
    // Skip API call on initial load if we already have bounds from URL
    if (skipNextFetch.current) {
      setFiltersState((prev) => ({ ...prev, bounds }));
      return;
    }

    setFiltersState((prev) => ({ ...prev, bounds }));
    setCurrentPage(1);
  }, []);

  return (
    <ListingsContext.Provider
      value={{
        listingsState: {
          ...listingsState,
          currentPage,
        },
        filters,
        isLoading,
        mapListings,
        isMapLoading,
        initialBounds,
        setFilters,
        clearFilters,
        setPage,
        setMapBounds,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error("useListings must be used within a ListingsProvider");
  }
  return context;
}
