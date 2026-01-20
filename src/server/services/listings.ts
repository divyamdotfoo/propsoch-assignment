import { Listings as ListingData } from "../data";
import {
  Listing,
  SearchListingsParams,
  SearchListingsResult,
} from "@/types/listing";

/**
 * Simulate database delay (200-300ms)
 */
const simulateDbDelay = async (): Promise<void> => {
  const randomDelay = 500 + Math.random() * 300;
  await new Promise((resolve) => setTimeout(resolve, randomDelay));
};

class ListingService {
  private readonly data: Listing[];
  private readonly PAGE_LIMIT = 10;

  constructor() {
    this.data = ListingData.projects as Listing[];
  }

  async getTotalCount() {
    await simulateDbDelay();
    return this.data.length;
  }

  async getUniqueListingTypes(): Promise<string[]> {
    await simulateDbDelay();
    const typesSet = new Set(this.data.map((listing) => listing.type));
    const types = Array.from(typesSet);
    return types.sort();
  }

  async getUniqueMicromarkets(): Promise<string[]> {
    await simulateDbDelay();
    const micromarketsSet = new Set(
      this.data.map((listing) => listing.micromarket)
    );
    const micromarkets = Array.from(micromarketsSet);
    return micromarkets.sort();
  }

  async getPriceRange(): Promise<{ min: number; max: number }> {
    await simulateDbDelay();
    const prices = this.data.flatMap((listing) => [
      listing.minPrice,
      listing.maxPrice,
    ]);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  async getById(id: number): Promise<Listing | null> {
    await simulateDbDelay();

    const listing = this.data.find((l) => l.id === id);
    return listing || null;
  }

  async search(
    params: SearchListingsParams = {}
  ): Promise<SearchListingsResult> {
    const {
      city,
      micromarket,
      type,
      minPrice,
      maxPrice,
      name,
      page = 1,
      bounds,
      noPagination = false,
    } = params;

    await simulateDbDelay();

    const filtered = this.data.filter((listing) => {
      // City filter
      if (city && listing.city.toLowerCase() !== city.toLowerCase()) {
        return false;
      }

      // Micromarket filter
      if (
        micromarket &&
        listing.micromarket.toLowerCase() !== micromarket.toLowerCase()
      ) {
        return false;
      }

      // Type filter
      if (type && listing.type.toLowerCase() !== type.toLowerCase()) {
        return false;
      }

      // Price range filter
      if (minPrice !== undefined && listing.maxPrice < minPrice) {
        return false;
      }

      if (maxPrice !== undefined && listing.minPrice > maxPrice) {
        return false;
      }

      // Name search filter
      if (name && !listing.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }

      // Map bounds filter
      if (bounds) {
        const { swLat, swLng, neLat, neLng } = bounds;
        if (
          listing.latitude < swLat ||
          listing.latitude > neLat ||
          listing.longitude < swLng ||
          listing.longitude > neLng
        ) {
          return false;
        }
      }

      return true;
    });

    const totalListings = filtered.length;

    // Return all results without pagination if noPagination is true
    if (noPagination) {
      return {
        listings: filtered,
        totalPages: 1,
        currentPage: 1,
        totalListings,
      };
    }

    const totalPages = Math.ceil(totalListings / this.PAGE_LIMIT);
    const startIndex = (page - 1) * this.PAGE_LIMIT;
    const endIndex = startIndex + this.PAGE_LIMIT;

    const listings = filtered.slice(startIndex, endIndex);

    return {
      listings,
      totalPages,
      currentPage: page,
      totalListings,
    };
  }
}

export const listingService = new ListingService();
