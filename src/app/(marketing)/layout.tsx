import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import PageViewTracker from "@/components/analytics/PageViewTracker";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageViewTracker />
      <Navbar />
      <main className="pt-20 flex-grow">{children}</main>
      <Footer />
    </>
  );
}
