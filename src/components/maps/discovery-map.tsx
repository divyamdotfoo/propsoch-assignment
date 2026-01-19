import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";

import { JSX, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { PropscoreRating } from "@/assets/PropsochRating";
import {
  cn,
  concatenateTypologies,
  formatDate,
  formatPrice,
  para,
} from "@/utils/helpers";
import { BudgetIcon } from "@/assets/budget-icon";
import { HouseIcon } from "@/assets/house-icon";
import { LocationIcon } from "@/assets/location-icon";
import { CalendarIcon } from "@/assets/utility";
import L from "leaflet";
import { LocationType, Listing } from "@/types/listing";
import { Badge } from "../badge";
import { renderToString } from "react-dom/server";

interface Location {
  lat: number;
  lon: number;
  name: string;
}

interface DiscoveryMapProps {
  listings: Listing[];
}

export function DiscoveryMap({ listings }: Readonly<DiscoveryMapProps>) {
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    null
  );
  const sectionRef = useRef(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (selectedLocation) {
      const found = listings.find(
        (listing: Listing) => listing.name == selectedLocation.name
      );
      setSelectedListing(found || null);
      const el = document.querySelector(
        `[data-marker-id="${selectedLocation.name}"]`
      ) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedLocation, listings]);

  return (
    <section
      ref={sectionRef}
      style={{ fontFamily: "Arial, sans-serif" }}
      className="flex aspect-auto h-full flex-col gap-4 overflow-hidden"
      aria-label={`Project discovery via map`}
    >
      {/* Map Container */}
      <div className="relative size-full overflow-hidden">
        <MapContainer
          center={[12.97, 77.59]}
          zoom={12}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          className="border-lightborder z-10 size-full rounded-lg border object-cover"
          aria-label="Map view"
        >
          <LayersControl position="bottomleft">
            {/* Street View */}
            <LayersControl.BaseLayer checked name="Street View">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            {/* Satellite View (Esri) */}
            <LayersControl.BaseLayer name="Satellite View">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <MapClickHandler onClick={() => setSelectedLocation(null)} />
          <MapController selectedLocation={selectedLocation} />

          {/* Project Location Marker */}

          {listings && listings.length > 0
            ? listings.map((listing: Listing) => (
                <Marker
                  position={[listing.latitude, listing.longitude]}
                  key={listing.id}
                  icon={getOtherLocationIcon(
                    listing.name,
                    selectedListing?.id == listing.id
                  )}
                />
              ))
            : null}
          {selectedLocation && selectedListing && (
            <Popup
              position={[selectedLocation.lat, selectedLocation.lon]}
              autoClose={false}
              closeOnClick={false}
              offset={[0, -20]}
              closeOnEscapeKey
              minWidth={400}
              closeButton
            >
              <Link
                href={`/property-for-sale-in/${selectedListing.city.toLowerCase()}/${selectedListing.slug.toLowerCase()}/${
                  selectedListing.id
                }`}
                target="_blank"
              >
                <div className="flex w-full flex-col gap-3">
                  <Image
                    src={selectedListing.image}
                    alt={selectedListing.alt}
                    width={500}
                    height={500}
                    loading="lazy"
                    className={cn(
                      "aspect-video size-full rounded-lg object-cover transition-all duration-400 ease-in-out",
                      selectedListing.projectStatus === "soldOut" && "grayscale"
                    )}
                  />
                  <h3
                    className={cn(
                      para({ size: "lg", color: "dark" }),
                      "font-semibold"
                    )}
                  >
                    {selectedListing.name}
                  </h3>

                  <div className="flex flex-col gap-3 whitespace-nowrap">
                    <div className="flex w-full items-center justify-between">
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full items-center gap-2"
                        )}
                      >
                        <LocationIcon width={20} height={20} />
                        <span>{selectedListing.micromarket}</span>
                      </span>
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full items-center justify-end gap-2"
                        )}
                      >
                        <PropscoreRating
                          rating={selectedListing.propscore}
                          width={110}
                          height={24}
                          className={"ml-auto w-max max-w-40"}
                        />
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between gap-3">
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full max-w-40 items-center gap-2 truncate"
                        )}
                      >
                        <BudgetIcon width={20} height={20} />
                        {formatPrice(selectedListing.minPrice, false)} -{" "}
                        {formatPrice(selectedListing.maxPrice, false)}
                      </span>
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full items-center justify-end gap-2"
                        )}
                      >
                        <CalendarIcon height={20} width={20} />
                        {formatDate(selectedListing.possessionDate)}
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between gap-3">
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full max-w-40 items-center gap-2 truncate"
                        )}
                      >
                        <HouseIcon width={20} height={20} />
                        <span className="w-32 max-w-32 truncate">
                          {concatenateTypologies(selectedListing.typologies)}
                        </span>
                      </span>
                      <span
                        className={cn(
                          para({ color: "dark", size: "sm" }),
                          "flex w-full items-center justify-end gap-2"
                        )}
                      >
                        {selectedListing.minSaleableArea} -{" "}
                        {selectedListing.maxSaleableArea} sqft
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Popup>
          )}
        </MapContainer>
      </div>
    </section>
  );
}

// keeping utilities functions below the main export

export const renderIcon = (
  icon: JSX.Element,
  ariaLabel: string,
  transform = "translate(-8px, -4px)"
) =>
  `<div style="transform: ${transform}" aria-label="${ariaLabel}" role="button">${renderToString(
    icon
  )}</div>`;

function getOtherLocationIcon(
  label: string,
  isSelected: boolean,
  icon = true
): L.DivIcon {
  return L.divIcon({
    html: renderIcon(
      <Badge variant={"white"} className="w-max whitespace-nowrap">
        {label}
      </Badge>,
      label,
      isSelected ? "translate(-10px, -20px)" : "translate(-15px, -20px)"
    ),
  });
}

function MapClickHandler({ onClick }: { onClick: () => void }) {
  useMapEvents({
    click: () => onClick(),
  });
  return null;
}

function MapController({
  selectedLocation,
}: Readonly<{
  selectedLocation: Location | null;
}>) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.panTo([selectedLocation.lat, selectedLocation.lon], {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selectedLocation, map]);

  return null;
}
