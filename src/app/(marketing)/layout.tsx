import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { CreativeEngineLoader } from "@/components/ui/CreativeEngineLoader";
import { EcosystemRoot } from "@/components/creative-engine/EcosystemRoot";
import JsonLd from "@/components/seo/JsonLd";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EcosystemRoot>
      <CreativeEngineLoader>
        <JsonLd />
        <PageViewTracker />
        <Navbar />
        <main id="main-content" className="pt-20 flex-grow">{children}</main>
        <Footer />
      </CreativeEngineLoader>
    </EcosystemRoot>
  );
}
