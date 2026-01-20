import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useCallback, useRef, useMemo } from "react";
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { Listing, MapBounds } from "@/types/listing";
import { formatPrice } from "@/utils/helpers";

interface DiscoveryMapProps {
  listings: Listing[];
  onBoundsChange: (bounds: MapBounds) => void;
  isLoading?: boolean;
  initialBounds?: MapBounds | null;
}

const DEFAULT_CENTER: [number, number] = [12.97, 77.59];
const DEFAULT_ZOOM = 12;

const mapStyles = `
  .custom-price-marker {
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }
  .custom-price-marker:hover {
    transform: scale(1.12);
    z-index: 1000 !important;
  }
  .custom-price-marker:hover .price-tag {
    background-color: #1a1a1a !important;
    color: white !important;
    border-color: #1a1a1a !important;
  }
  .custom-cluster-icon {
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }
  .custom-cluster-icon:hover {
    transform: scale(1.1);
    z-index: 1000 !important;
  }
  .leaflet-popup-content-wrapper {
    padding: 0 !important;
    border-radius: 12px !important;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
  }
  .leaflet-popup-content { margin: 0 !important; width: 280px !important; }
  .leaflet-popup-tip-container { display: none; }
  .leaflet-popup-close-button { display: none !important; }
`;

export function DiscoveryMap({
  listings,
  onBoundsChange,
  isLoading,
  initialBounds,
}: Readonly<DiscoveryMapProps>) {
  const { center, bounds } = useMemo(() => {
    if (initialBounds) {
      const centerLat = (initialBounds.swLat + initialBounds.neLat) / 2;
      const centerLng = (initialBounds.swLng + initialBounds.neLng) / 2;
      return {
        center: [centerLat, centerLng] as [number, number],
        bounds: L.latLngBounds(
          [initialBounds.swLat, initialBounds.swLng],
          [initialBounds.neLat, initialBounds.neLng]
        ),
      };
    }
    return { center: DEFAULT_CENTER, bounds: null };
  }, [initialBounds]);

  return (
    <section
      className="flex aspect-auto h-full flex-col overflow-hidden relative font-sans"
      aria-label="Property discovery via map"
    >
      <style>{mapStyles}</style>

      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1000">
          <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-700">
              Loading...
            </span>
          </div>
        </div>
      )}

      <div className="relative size-full overflow-hidden rounded-2xl">
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          bounds={bounds || undefined}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          wheelDebounceTime={150}
          wheelPxPerZoomLevel={120}
          zoomSnap={1}
          zoomDelta={1}
          className="z-10 size-full rounded-2xl"
          aria-label="Map view"
        >
          <LayersControl position="bottomleft">
            <LayersControl.BaseLayer checked name="Street View">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite View">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.esri.com">Esri</a>'
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <MapBoundsHandler
            onBoundsChange={onBoundsChange}
            initialBounds={initialBounds}
          />

          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterIcon}
            maxClusterRadius={60}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            disableClusteringAtZoom={16}
          >
            {listings.map((listing) => (
              <ListingMarker key={listing.id} listing={listing} />
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </section>
  );
}

// Popup dimensions
const POPUP_WIDTH = 280;
const POPUP_HEIGHT = 270;
const MARGIN = 20;

function ListingMarker({ listing }: { listing: Listing }) {
  const map = useMap();
  const markerRef = useRef<L.Marker>(null);
  const popupRef = useRef<L.Popup>(null);

  // Reposition popup after it opens
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || !map) return;

    const repositionPopup = () => {
      // Small delay to ensure popup is fully rendered
      requestAnimationFrame(() => {
        const popup = marker.getPopup();
        if (!popup) return;

        const popupEl = popup.getElement();
        if (!popupEl) return;

        // Get marker position in container pixels
        const markerLatLng = marker.getLatLng();
        const markerPoint = map.latLngToContainerPoint(markerLatLng);
        const mapContainer = map.getContainer();
        const containerRect = mapContainer.getBoundingClientRect();

        // Get actual popup dimensions after render
        const popupRect = popupEl.getBoundingClientRect();
        const actualPopupHeight = popupRect.height || POPUP_HEIGHT;
        const actualPopupWidth = popupRect.width || POPUP_WIDTH;

        // Available space in each direction
        const spaceAbove = markerPoint.y;
        const spaceBelow = containerRect.height - markerPoint.y;
        const spaceLeft = markerPoint.x;
        const spaceRight = containerRect.width - markerPoint.x;

        // Get the wrapper element (the one Leaflet positions)
        const wrapper = popupEl.querySelector(
          ".leaflet-popup-content-wrapper"
        ) as HTMLElement;
        if (!wrapper) return;

        // Reset any previous transforms
        wrapper.style.transform = "";

        let translateY = 0;
        let translateX = 0;

        // Vertical positioning: flip to below if not enough space above
        if (
          spaceAbove < actualPopupHeight + MARGIN &&
          spaceBelow > spaceAbove
        ) {
          translateY = actualPopupHeight + 25; // Move below marker
        }

        // Horizontal positioning: shift if too close to edges
        const halfWidth = actualPopupWidth / 2;
        if (spaceLeft < halfWidth + MARGIN) {
          translateX = halfWidth - spaceLeft + MARGIN;
        } else if (spaceRight < halfWidth + MARGIN) {
          translateX = -(halfWidth - spaceRight + MARGIN);
        }

        // Apply transform to content wrapper
        if (translateX !== 0 || translateY !== 0) {
          wrapper.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
      });
    };

    marker.on("popupopen", repositionPopup);

    return () => {
      marker.off("popupopen", repositionPopup);
    };
  }, [map]);

  return (
    <Marker
      ref={markerRef}
      position={[listing.latitude, listing.longitude]}
      icon={createPriceIcon(listing.minPrice)}
    >
      <Popup
        ref={popupRef}
        offset={[0, -5]}
        autoPan={false}
        closeButton={false}
        minWidth={280}
        maxWidth={280}
      >
        <ListingPopup
          listing={listing}
          onClose={() => markerRef.current?.closePopup()}
        />
      </Popup>
    </Marker>
  );
}

function ListingPopup({
  listing,
  onClose,
}: {
  listing: Listing;
  onClose: () => void;
}) {
  const minPrice = formatPrice(listing.minPrice, false);
  const maxPrice = formatPrice(listing.maxPrice, false);

  return (
    <div className="font-sans">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={listing.image}
          alt={listing.alt}
          className="w-full h-40 object-cover block hover:scale-[1.02] transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
          aria-label="Close"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#222"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-[11px] font-semibold uppercase tracking-wide">
          {listing.type}
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <span className="text-sm font-semibold text-gray-900">
            {listing.type} in {listing.micromarket}
          </span>
          <div className="flex items-center gap-1 ml-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#222">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-[13px] font-medium">
              {listing.propscore.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-[13px] text-gray-500 mb-1.5 truncate">
          {listing.name}
        </p>

        <p className="text-xs text-gray-500 mb-2">
          {listing.typologies.join(", ")} •{" "}
          {listing.minSaleableArea.toLocaleString()} -{" "}
          {listing.maxSaleableArea.toLocaleString()} sq.ft
        </p>

        <p className="text-[15px] font-semibold text-gray-900">
          ₹{minPrice}
          {listing.minPrice !== listing.maxPrice && (
            <span className="text-gray-500 font-normal"> - </span>
          )}
          {listing.minPrice !== listing.maxPrice && `₹${maxPrice}`}
        </p>
      </div>
    </div>
  );
}

function MapBoundsHandler({
  onBoundsChange,
  initialBounds,
}: {
  onBoundsChange: (bounds: MapBounds) => void;
  initialBounds?: MapBounds | null;
}) {
  const map = useMap();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoad = useRef(true);

  const handleBoundsChange = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      onBoundsChange({
        swLat: sw.lat,
        swLng: sw.lng,
        neLat: ne.lat,
        neLng: ne.lng,
      });
    }, 300);
  }, [map, onBoundsChange]);

  useEffect(() => {
    if (isFirstLoad.current && initialBounds) {
      map.fitBounds([
        [initialBounds.swLat, initialBounds.swLng],
        [initialBounds.neLat, initialBounds.neLng],
      ]);
      isFirstLoad.current = false;
      handleBoundsChange();
    } else if (isFirstLoad.current) {
      isFirstLoad.current = false;
      handleBoundsChange();
    }
  }, [map, initialBounds, handleBoundsChange]);

  useMapEvents({ moveend: handleBoundsChange, zoomend: handleBoundsChange });

  return null;
}

function createClusterIcon(cluster: {
  getChildCount: () => number;
}): L.DivIcon {
  return L.divIcon({
    html: `<div style="background:white;padding:8px 12px;border-radius:20px;box-shadow:0 2px 8px rgba(0,0,0,0.2);font-size:13px;font-weight:700;color:#1a1a1a;border:2px solid #e5e5e5;display:flex;align-items:center;justify-content:center;min-width:40px">${cluster.getChildCount()}</div>`,
    className: "custom-cluster-icon",
    iconSize: [50, 36],
    iconAnchor: [25, 18],
  });
}

function createPriceIcon(price: number): L.DivIcon {
  return L.divIcon({
    html: `<div class="price-tag" style="background:white;padding:6px 10px;border-radius:20px;box-shadow:0 2px 8px rgba(0,0,0,0.15);font-size:13px;font-weight:600;color:#1a1a1a;border:1px solid #e5e5e5;transition:all .15s cubic-bezier(.4,0,.2,1)">₹${formatPrice(price, false)}</div>`,
    className: "custom-price-marker",
    iconSize: [80, 30],
    iconAnchor: [40, 15],
  });
}
