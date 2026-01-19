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
  const randomDelay = 200 + Math.random() * 100;
  await new Promise((resolve) => setTimeout(resolve, randomDelay));
};


class ListingService {
  private readonly data: Listing[];
  private readonly PAGE_LIMIT = 10;

  constructor() {
    this.data = ListingData.projects as Listing[];
  }


  async getById(id: number): Promise<Listing | null> {
    await simulateDbDelay();
    
    const listing = this.data.find(l => l.id === id);
    return listing || null;
  }

  async search(params: SearchListingsParams = {}): Promise<SearchListingsResult> {
    const {
      city,
      micromarket,
      type,
      minPrice,
      maxPrice,
      name,
      page = 1,
    } = params;

    await simulateDbDelay();

    const filtered = this.data.filter((listing) => {
      // City filter
      if (city && listing.city.toLowerCase() !== city.toLowerCase()) {
        return false;
      }

      // Micromarket filter
      if (micromarket && listing.micromarket.toLowerCase() !== micromarket.toLowerCase()) {
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

      return true;
    });

    const totalListings = filtered.length;
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
