import DiscoveryMapWrapper from "@/components/maps";
import { listingService } from "@/server/services/property";

//TODO : Add meta data for this page
// Page should serve via SSR
// Do not add "use client" declarative

// TODO: Create a List view for these listings.
// Use your own imagination while designing, please don't copy Propsoch's current UI.
// We don't like it either.
// Add pagination
// You can modify the listings however you want. If you feel like creating an API and implementing pagination via that, totally your call.

export default async function Page() {
  const listingsResult = await listingService.search();

  return (
    <div className="w-screen h-screen">
      <DiscoveryMapWrapper listings={listingsResult.listings} />
    </div>
  );
}
