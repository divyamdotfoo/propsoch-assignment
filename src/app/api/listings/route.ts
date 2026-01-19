import { listingService } from "@/server/services/listings";
import { NextRequest, NextResponse } from "next/server";
import { parseToServiceParams } from "@/utils/search-params";

export async function GET(request: NextRequest) {
  const params = parseToServiceParams(request.nextUrl.searchParams);
  const result = await listingService.search(params);
  return NextResponse.json(result);
}
