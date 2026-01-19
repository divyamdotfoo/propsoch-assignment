"use client";
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
    allFilteredData: any;
};

export default function DiscoveryMapWrapper({
    allFilteredData,
}: DiscoveryMapWrapperProps) {
    return <DiscoveryMap allFilteredData={allFilteredData} />;
}
