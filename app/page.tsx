import { AmenitiesSection } from "@/components/amenities-section";
import { ContactSection } from "@/components/contact-section";
import { ExperienceSection } from "@/components/experience-section";
import { GallerySection } from "@/components/gallery-section";
import { GiftShopSection } from "@/components/gift-shop-section";
import { HeroSection } from "@/components/hero-section";
import { InfoStrip } from "@/components/info-strip";
import { RatesSection } from "@/components/rates-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <InfoStrip />
        <RatesSection />
        <ExperienceSection />
        <AmenitiesSection />
        <GallerySection />
        <GiftShopSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
