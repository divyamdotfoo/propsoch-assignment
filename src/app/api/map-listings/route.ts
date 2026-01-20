import { listingService } from "@/server/services/listings";
import { NextRequest, NextResponse } from "next/server";
import { parseToServiceParams } from "@/utils/search-params";

/**
 * API endpoint for map listings - returns ALL listings matching filters (no pagination)
 * Uses the same search function as listings API but with noPagination=true
 */
export async function GET(request: NextRequest) {
  const params = parseToServiceParams(request.nextUrl.searchParams);

  // Validate bounds parameters for map endpoint
  if (!params.bounds) {
    return NextResponse.json(
      { error: "Missing bounds parameters (swLat, swLng, neLat, neLng)" },
      { status: 400 }
    );
  }

  // Use the same search function with noPagination to get all results
  const result = await listingService.search({
    ...params,
    noPagination: true,
  });

  return NextResponse.json({ listings: result.listings });
}
