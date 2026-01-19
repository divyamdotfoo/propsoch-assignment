import { ListingType } from "@/types/listing";

/**
 * Centralized search param keys - change here to update everywhere
 */
export const SEARCH_PARAM_KEYS = {
  MICROMARKET: "micromarket",
  TYPE: "type",
  MIN_PRICE: "minPrice",
  MAX_PRICE: "maxPrice",
  NAME: "name",
  PAGE: "page",
  CITY: "city",
} as const;

/**
 * Filters state type - shared between client and server
 */
export interface FiltersState {
  micromarket: string | null;
  type: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  name: string | null;
}

/**
 * Default empty filters
 */
export const DEFAULT_FILTERS: FiltersState = {
  micromarket: null,
  type: null,
  minPrice: null,
  maxPrice: null,
  name: null,
};

/**
 * Parse URLSearchParams to FiltersState
 * Works on both client and server
 */
export function parseSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): FiltersState {
  // Handle both URLSearchParams and Next.js searchParams object
  const get = (key: string): string | null => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key);
    }
    const value = searchParams[key];
    if (Array.isArray(value)) return value[0] || null;
    return value || null;
  };

  const minPriceStr = get(SEARCH_PARAM_KEYS.MIN_PRICE);
  const maxPriceStr = get(SEARCH_PARAM_KEYS.MAX_PRICE);

  return {
    micromarket: get(SEARCH_PARAM_KEYS.MICROMARKET),
    type: get(SEARCH_PARAM_KEYS.TYPE),
    minPrice: minPriceStr ? Number(minPriceStr) : null,
    maxPrice: maxPriceStr ? Number(maxPriceStr) : null,
    name: get(SEARCH_PARAM_KEYS.NAME),
  };
}

/**
 * Parse search params to listing service params format
 */
export function parseToServiceParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
) {
  const get = (key: string): string | null => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key);
    }
    const value = searchParams[key];
    if (Array.isArray(value)) return value[0] || null;
    return value || null;
  };

  const minPriceStr = get(SEARCH_PARAM_KEYS.MIN_PRICE);
  const maxPriceStr = get(SEARCH_PARAM_KEYS.MAX_PRICE);
  const pageStr = get(SEARCH_PARAM_KEYS.PAGE);

  return {
    city: get(SEARCH_PARAM_KEYS.CITY) || undefined,
    micromarket: get(SEARCH_PARAM_KEYS.MICROMARKET) || undefined,
    type: (get(SEARCH_PARAM_KEYS.TYPE) as ListingType) || undefined,
    minPrice: minPriceStr ? Number(minPriceStr) : undefined,
    maxPrice: maxPriceStr ? Number(maxPriceStr) : undefined,
    name: get(SEARCH_PARAM_KEYS.NAME) || undefined,
    page: pageStr ? Number(pageStr) : 1,
  };
}

/**
 * Convert FiltersState to URLSearchParams
 */
export function filtersToSearchParams(
  filters: FiltersState,
  page?: number
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.micromarket) {
    params.set(SEARCH_PARAM_KEYS.MICROMARKET, filters.micromarket);
  }
  if (filters.type) {
    params.set(SEARCH_PARAM_KEYS.TYPE, filters.type);
  }
  if (filters.minPrice !== null) {
    params.set(SEARCH_PARAM_KEYS.MIN_PRICE, String(filters.minPrice));
  }
  if (filters.maxPrice !== null) {
    params.set(SEARCH_PARAM_KEYS.MAX_PRICE, String(filters.maxPrice));
  }
  if (filters.name) {
    params.set(SEARCH_PARAM_KEYS.NAME, filters.name);
  }
  if (page && page > 1) {
    params.set(SEARCH_PARAM_KEYS.PAGE, String(page));
  }

  return params;
}

/**
 * Update browser URL with filters using replaceState (no reload)
 * Client-side only
 */
export function updateBrowserUrl(filters: FiltersState, page: number): void {
  if (typeof window === "undefined") return;

  const params = filtersToSearchParams(filters, page);
  const queryString = params.toString();
  const newUrl = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;

  window.history.replaceState(null, "", newUrl);
}

/**
 * Check if filters have any active values
 */
export function hasActiveFilters(filters: FiltersState): boolean {
  return !!(
    filters.micromarket ||
    filters.type ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.name
  );
}

