import { Suspense } from "react";
import { AmenitiesSection } from "@/components/amenities-section";
import { ContactSection } from "@/components/contact-section";
import { ExperienceSection } from "@/components/experience-section";
import { GallerySection } from "@/components/gallery-section";
import { GiftShopSection } from "@/components/gift-shop-section";
import { HeroSection } from "@/components/hero-section";
import { InfoStrip } from "@/components/info-strip";
import { RatesSection } from "@/components/rates-section";
import { SiteFooter } from "@/components/site-footer";
import { StickySiteChrome } from "@/components/sticky-site-chrome";
import { TestimonialsSection, TestimonialsSectionFallback } from "@/components/testimonials-section";
import { getLiveSite } from "@/lib/site-live";

export default async function Home() {
  const site = await getLiveSite();

  return (
    <div className="flex min-h-full flex-col">
      <StickySiteChrome site={site} />
      <main className="flex-1">
        <HeroSection site={site} />
        <InfoStrip site={site} />
        <RatesSection site={site} />
        <ExperienceSection />
        <AmenitiesSection />
        <GallerySection />
        <GiftShopSection site={site} />
        <Suspense fallback={<TestimonialsSectionFallback />}>
          <TestimonialsSection site={site} />
        </Suspense>
        <ContactSection site={site} />
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
