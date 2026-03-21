import { SiteHeader } from '@/components/layout/site-header';
import { FeatureGrid } from '@/components/marketing/feature-grid';
import { HeroSection } from '@/components/marketing/hero-section';
import { ProductPreview } from '@/components/marketing/product-preview';

export default function MarketingPage() {
  return (
    <div className="marketing-shell">
      <SiteHeader />
      <main className="marketing-main">
        <HeroSection />
        <FeatureGrid />
        <ProductPreview />
      </main>
    </div>
  );
}
