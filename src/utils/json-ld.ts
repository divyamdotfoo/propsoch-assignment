// Example JSON-LD Schema following the Schema.org specification with schema-dts library.

import type {
  WithContext,
  WebApplication,
  RealEstateAgent,
  WebSite,
  BreadcrumbList,
  OfferCatalog,
  Product,
  AggregateOffer,
  PostalAddress,
  ListItem,
  SearchAction,
  EntryPoint,
  AggregateRating,
  Offer,
  Country,
} from "schema-dts";
import type { Listing } from "@/types/listing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const SITE_NAME = "PlotPirate";

export function generateWebApplicationSchema(
  totalListings: number
): WithContext<WebApplication> {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    applicationCategory: "RealEstateApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    } as Offer,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: "1000",
    } as AggregateRating,
    description: `Discover ${totalListings}+ premium properties across India on ${SITE_NAME}'s interactive discovery map.`,
    url: SITE_URL,
    sameAs: [
      "https://www.facebook.com/plotpirate",
      "https://www.twitter.com/plotpirate",
      "https://www.linkedin.com/company/plotpirate",
      "https://www.instagram.com/plotpirate",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      } as EntryPoint,
      "query-input": "required name=search_term_string",
    } as SearchAction,
  };
}

export function generateRealEstateAgentSchema(
  listings: Listing[]
): WithContext<RealEstateAgent> {
  const address: PostalAddress = {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressRegion: "Karnataka",
    addressLocality: "Bengaluru",
  };

  const areaServed: Country = {
    "@type": "Country",
    name: "India",
  };

  const itemListElement: ListItem[] = listings
    .slice(0, 10)
    .map((listing, index) => {
      const productAddress: PostalAddress = {
        "@type": "PostalAddress",
        addressLocality: listing.micromarket,
        addressRegion: listing.city,
        addressCountry: "IN",
      };

      // Using type assertion since schema-dts Product type doesn't include address,
      // but Schema.org Product schema supports it for real estate properties
      const product = {
        "@type": "Product",
        name: listing.name,
        description: `${listing.name} - ${listing.typologies.join(", ")} properties in ${listing.micromarket}, ${listing.city}`,
        category: listing.type,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: listing.minPrice.toString(),
          highPrice: listing.maxPrice.toString(),
          offerCount: "1",
        } as AggregateOffer,
        address: productAddress,
      } as Product & { address: PostalAddress };

      return {
        "@type": "ListItem",
        position: index + 1,
        item: product,
      } as ListItem;
    });

  const hasOfferCatalog: OfferCatalog = {
    "@type": "OfferCatalog",
    name: "Property Listings",
    itemListElement,
  };

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE_NAME,
    description:
      "Property discovery platform helping users find their dream homes",
    url: SITE_URL,
    address,
    areaServed,
    hasOfferCatalog,
  };
}

export function generateWebSiteSchema(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      } as EntryPoint,
      "query-input": "required name=search_term_string",
    } as SearchAction,
  };
}

export function generateBreadcrumbListSchema(): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      } as ListItem,
      {
        "@type": "ListItem",
        position: 2,
        name: "Property Discovery",
        item: `${SITE_URL}/discovery`,
      } as ListItem,
    ],
  };
}
