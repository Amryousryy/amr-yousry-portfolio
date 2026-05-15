import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { CreativeEngineLoader } from "@/components/ui/CreativeEngineLoader";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CreativeEngineLoader>
      <PageViewTracker />
      <Navbar />
      <main className="pt-20 flex-grow">{children}</main>
      <Footer />
    </CreativeEngineLoader>
  );
}
