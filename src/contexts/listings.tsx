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
    SEARCH_PARAM_KEYS,
} from "@/utils/search-params";

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

    // Actions
    setFilters: (filters: Partial<FiltersState>) => void;
    clearFilters: () => void;
    setPage: (page: number) => void;
    fetchListings: () => Promise<void>;
    setListingsState: (state: ListingsState) => void;
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
    const [isLoading, setIsLoading] = useState(false);
    const isInitialMount = useRef(true);

    const fetchListings = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = filtersToSearchParams(filters, listingsState.currentPage);
            params.set(SEARCH_PARAM_KEYS.PAGE, String(listingsState.currentPage));

            const response = await fetch(`/api/listings?${params.toString()}`);
            const data = await response.json();

            setListingsState({
                listings: data.listings,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                totalListings: data.totalListings,
            });
        } catch (error) {
            console.error("Failed to fetch listings:", error);
        } finally {
            setIsLoading(false);
        }
    }, [filters, listingsState.currentPage]);

    // Auto-fetch when filters change (skip initial mount)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        fetchListings();
    }, [filters]);

    // Sync filters to browser URL
    useEffect(() => {
        updateBrowserUrl(filters, listingsState.currentPage);
    }, [filters, listingsState.currentPage]);

    const setFilters = useCallback((newFilters: Partial<FiltersState>) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }));
        // Reset to page 1 when filters change
        setListingsState((prev) => ({ ...prev, currentPage: 1 }));
    }, []);

    const clearFilters = useCallback(() => {
        setFiltersState(DEFAULT_FILTERS);
        setListingsState((prev) => ({ ...prev, currentPage: 1 }));
    }, []);

    const setPage = useCallback(
        (page: number) => {
            setListingsState((prev) => ({ ...prev, currentPage: page }));
            // Fetch with new page
            setIsLoading(true);
            const params = filtersToSearchParams(filters, page);
            params.set(SEARCH_PARAM_KEYS.PAGE, String(page));

            fetch(`/api/listings?${params.toString()}`)
                .then((res) => res.json())
                .then((data) => {
                    setListingsState({
                        listings: data.listings,
                        totalPages: data.totalPages,
                        currentPage: data.currentPage,
                        totalListings: data.totalListings,
                    });
                })
                .catch((error) => {
                    console.error("Failed to fetch listings:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [filters]
    );

    return (
        <ListingsContext.Provider
            value={{
                listingsState,
                filters,
                isLoading,
                setFilters,
                clearFilters,
                setPage,
                fetchListings,
                setListingsState,
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

// Re-export FiltersState for convenience
export type { FiltersState };
