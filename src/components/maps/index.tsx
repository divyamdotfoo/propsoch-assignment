"use client";
import { Listing } from "@/types/listing";
import dynamic from "next/dynamic";

const DiscoveryMap = dynamic(
    () => import("./discovery-map").then((mod) => mod.DiscoveryMap),
    {
        ssr: false,
        loading: () => {
            return <div>Loading...</div>;
        },
    }
);

type DiscoveryMapWrapperProps = {
    listings: Listing[];
};

export default function DiscoveryMapWrapper({
    listings,
}: DiscoveryMapWrapperProps) {
    return <DiscoveryMap listings={listings} />;
}
