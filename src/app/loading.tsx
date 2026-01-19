import { ListingsGridSkeleton, MapSkeleton } from "@/components/card-skeleton";
import { NavbarSkeleton } from "@/components/navbar-skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarSkeleton />

            <main className="flex flex-1 bg-[#F7F7F7]">
                {/* Left Side - Listings Grid Skeleton */}
                <div className="w-1/2 bg-white">
                    <ListingsGridSkeleton />
                </div>

                {/* Right Side - Map Skeleton (Sticky) */}
                <div className="w-1/2 h-[calc(100vh-65px)] sticky top-[65px] p-4 pt-6 pr-6 pb-6 pl-4">
                    <MapSkeleton />
                </div>
            </main>
        </div>
    );
}
