import { listingService } from "@/server/services/listings";
import { Metadata } from "next";
import { ListingsGrid } from "@/components/listings-grid";
import { Navbar } from "@/components/navbar";
import { ListingsProvider } from "@/contexts/listings";
import { parseSearchParams, parseToServiceParams } from "@/utils/search-params";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const initialFilters = parseSearchParams(resolvedSearchParams);
  const serviceParams = parseToServiceParams(resolvedSearchParams);

  const [listingsResult, totalCount, listingTypes, micromarkets, priceRange] = await Promise.all([
    listingService.search(serviceParams),
    listingService.getTotalCount(),
    listingService.getUniqueListingTypes(),
    listingService.getUniqueMicromarkets(),
    listingService.getPriceRange(),
  ]);

  return (
    <ListingsProvider
      initialListings={listingsResult.listings}
      initialTotalPages={listingsResult.totalPages}
      initialCurrentPage={listingsResult.currentPage}
      initialTotalListings={listingsResult.totalListings}
      initialFilters={initialFilters}
    >
      <div className="flex flex-col min-h-screen">
        <Navbar
          listingTypes={listingTypes}
          micromarkets={micromarkets}
          priceRange={priceRange}
        />

        <main className="flex flex-1 bg-[#F7F7F7]">
          {/* Left Side - Listings Grid (Scrollable) */}
          <div className="w-1/2 bg-white">
            <ListingsGrid totalCount={totalCount} />
          </div>

          {/* Right Side - Map (Sticky) */}
          <div className="w-1/2 h-[calc(100vh-65px)] sticky top-[65px] pt-6 pr-6 pb-6 pl-4">
            <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-500 text-lg font-medium">Map Container</p>
                <p className="text-gray-400 text-sm mt-1">
                  Map component will be rendered here
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ListingsProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const totalCount = await listingService.getTotalCount();
  const primaryCity = "Bengaluru";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const canonicalUrl = `${siteUrl}`;

  return {
    title: {
      default:
        "PlotPirate - Discover Properties on Interactive Map | Real Estate Discovery Platform",
      template: "%s | PlotPirate",
    },
    description: `Discover ${totalCount}+ premium properties across ${primaryCity} on PlotPirate's interactive map. Find apartments, villas, plots, and row houses with detailed information, pricing, possession dates, and location insights. Start your property search today.`,

    keywords: [
      "property discovery",
      "real estate",
      "property search",
      "interactive map",
      "apartments for sale",
      "villas for sale",
      "plots for sale",
      "row houses",
      "property listings",
      "real estate map",
      "property finder",
      "Bengaluru properties",
      "property search map",
      "real estate discovery",
      "property location",
      "micromarket properties",
      "property prices",
      "possession date",
      "property rating",
      "property typologies",
    ],

    authors: [
      {
        name: "PlotPirate",
        url: siteUrl,
      },
    ],

    creator: "PlotPirate",

    publisher: "PlotPirate",

    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    metadataBase: new URL(siteUrl),

    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-IN": canonicalUrl,
        "en-US": canonicalUrl,
        en: canonicalUrl,
      },
      types: {
        "application/rss+xml": [
          {
            url: `${siteUrl}/feed.xml`,
            title: "PlotPirate Property Listings RSS Feed",
          },
        ],
      },
    },

    // Open Graph
    openGraph: {
      type: "website",
      locale: "en_IN",
      alternateLocale: ["en_US", "en"],
      url: canonicalUrl,
      siteName: "PlotPirate",
      title:
        "PlotPirate - Discover Properties on Interactive Map | Real Estate Discovery",
      description: `Explore ${totalCount}+ premium properties across ${primaryCity} on our interactive discovery map. Find your dream home with detailed insights, pricing, and location data.`,
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "PlotPirate Property Discovery Map - Find Your Dream Property",
          type: "image/jpeg",
        },
        {
          url: `${siteUrl}/og-image-square.jpg`,
          width: 1200,
          height: 1200,
          alt: "PlotPirate Property Discovery Platform",
          type: "image/jpeg",
        },
      ],
      countryName: "India",
      emails: ["contact@plotpirate.com"],
      phoneNumbers: ["+91-XXXXX-XXXXX"],
      determiner: "the",
      ttl: 3600,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      site: "@plotpirate",
      creator: "@plotpirate",
      title: "PlotPirate - Discover Properties on Interactive Map",
      description: `Explore ${totalCount}+ premium properties across ${primaryCity} on our interactive discovery map.`,
      images: [
        {
          url: `${siteUrl}/twitter-card.jpg`,
          alt: "PlotPirate Property Discovery Map",
          width: 1200,
          height: 630,
        },
      ],
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },

    // Icons
    icons: {
      icon: [
        {
          url: "/favicon.ico",
          sizes: "any",
        },
        {
          url: "/icon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/icon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/apple-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      other: [
        {
          rel: "mask-icon",
          url: "/safari-pinned-tab.svg",
          color: "#000000",
        },
      ],
    },

    // Manifest
    manifest: `${siteUrl}/manifest.json`,

    // Apple Web App
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "PlotPirate",
      startupImage: [
        {
          url: "/apple-startup-image.png",
          media:
            "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
        },
        {
          url: "/apple-startup-image.png",
          media:
            "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
        },
      ],
    },

    // Application name
    applicationName: "PlotPirate",

    // Referrer
    referrer: "origin-when-cross-origin",

    // Color scheme
    colorScheme: "light",

    // Theme color
    themeColor: [
      {
        media: "(prefers-color-scheme: light)",
        color: "#ffffff",
      },
      {
        media: "(prefers-color-scheme: dark)",
        color: "#000000",
      },
    ],
    category: "Real Estate",

    classification: "Property Discovery Platform",

    other: {
      "geo.region": "IN",
      "geo.placename": primaryCity,
      "geo.position": "12.9716;77.5946", // Bengaluru coordinates
      ICBM: "12.9716, 77.5946",
      "DC.title": "PlotPirate - Property Discovery Platform",
      "DC.creator": "PlotPirate",
      "DC.subject": "Real Estate, Property Discovery, Property Search",
      "DC.description": `Discover ${totalCount}+ premium properties across ${primaryCity}`,
      "DC.publisher": "PlotPirate",
      "DC.contributor": "PlotPirate",
      "DC.date": new Date().toISOString(),
      "DC.type": "Interactive Property Discovery Platform",
      "DC.format": "text/html",
      "DC.identifier": canonicalUrl,
      "DC.source": siteUrl,
      "DC.language": "en-IN",
      "DC.relation": canonicalUrl,
      "DC.coverage": "India",
      "DC.rights": "© PlotPirate. All rights reserved.",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": "PlotPirate",
      "application-name": "PlotPirate",
      "msapplication-TileColor": "#000000",
      "msapplication-TileImage": "/mstile-144x144.png",
      "msapplication-config": "/browserconfig.xml",
      "og:image:secure_url": `${siteUrl}/og-image.jpg`,
      "og:image:type": "image/jpeg",
      "og:image:width": "1200",
      "og:image:height": "630",
      "article:author": "PlotPirate",
      "article:publisher": siteUrl,
      "business:contact_data:street_address": "Your Street Address",
      "business:contact_data:locality": primaryCity,
      "business:contact_data:region": "Karnataka",
      "business:contact_data:postal_code": "560001",
      "business:contact_data:country_name": "India",
      "product:price:amount": "0",
      "product:price:currency": "INR",
      "product:availability": "in stock",
      "product:condition": "new",
      "product:retailer": "PlotPirate",
    },
  };
}
