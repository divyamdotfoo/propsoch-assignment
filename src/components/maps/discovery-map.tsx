import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useCallback, useRef, useMemo } from "react";
import {
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { Listing, MapBounds } from "@/types/listing";
import { formatPrice } from "@/utils/helpers";
import { renderToString } from "react-dom/server";

interface DiscoveryMapProps {
  listings: Listing[];
  onBoundsChange: (bounds: MapBounds) => void;
  isLoading?: boolean;
  initialBounds?: MapBounds | null;
}

// Default center for Bengaluru
const DEFAULT_CENTER: [number, number] = [12.97, 77.59];
const DEFAULT_ZOOM = 12;

export function DiscoveryMap({
  listings,
  onBoundsChange,
  isLoading,
  initialBounds,
}: Readonly<DiscoveryMapProps>) {
  // Calculate initial center and bounds from URL params if available
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
      style={{ fontFamily: "Arial, sans-serif" }}
      className="flex aspect-auto h-full flex-col overflow-hidden relative"
      aria-label="Property discovery via map"
    >
      {/* Top center loading indicator like Airbnb */}
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

      {/* Map Container */}
      <div className="relative size-full overflow-hidden rounded-2xl">
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          bounds={bounds || undefined}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          // Fix laggy zoom - one scroll = one zoom level
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

          {/* Clustered listing markers */}
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
              <Marker
                key={listing.id}
                position={[listing.latitude, listing.longitude]}
                icon={createPriceIcon(listing.minPrice)}
              />
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </section>
  );
}

/**
 * Component to handle map bounds changes
 */
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
    // Debounce the bounds change to avoid too many API calls
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

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

  // Set initial bounds from URL when map loads
  useEffect(() => {
    if (isFirstLoad.current && initialBounds) {
      // Fit map to initial bounds from URL
      map.fitBounds([
        [initialBounds.swLat, initialBounds.swLng],
        [initialBounds.neLat, initialBounds.neLng],
      ]);
      isFirstLoad.current = false;
      // Trigger bounds change to sync state
      handleBoundsChange();
    } else if (isFirstLoad.current) {
      isFirstLoad.current = false;
      handleBoundsChange();
    }
  }, [map, initialBounds, handleBoundsChange]);

  // Listen to map events
  useMapEvents({
    moveend: handleBoundsChange,
    zoomend: handleBoundsChange,
  });

  return null;
}

/**
 * Create a custom cluster icon showing count
 */
function createClusterIcon(cluster: {
  getChildCount: () => number;
}): L.DivIcon {
  const count = cluster.getChildCount();

  const iconHtml = renderToString(
    <div
      style={{
        backgroundColor: "white",
        padding: "8px 12px",
        borderRadius: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        fontSize: "13px",
        fontWeight: "700",
        color: "#1a1a1a",
        whiteSpace: "nowrap",
        border: "2px solid #e5e5e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "40px",
      }}
    >
      {count}
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-cluster-icon",
    iconSize: [50, 36],
    iconAnchor: [25, 18],
  });
}

/**
 * Create a price tag icon for map markers
 */
function createPriceIcon(price: number): L.DivIcon {
  const formattedPrice = `₹${formatPrice(price, false)}`;

  const iconHtml = renderToString(
    <div className="price-marker">
      <div
        style={{
          backgroundColor: "white",
          padding: "6px 10px",
          borderRadius: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          fontSize: "13px",
          fontWeight: "600",
          color: "#1a1a1a",
          whiteSpace: "nowrap",
          border: "1px solid #e5e5e5",
        }}
      >
        {formattedPrice}
      </div>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-price-marker",
    iconSize: [80, 30],
    iconAnchor: [40, 15],
  });
}
