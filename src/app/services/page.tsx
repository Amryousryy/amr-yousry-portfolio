"use client";

import dynamic from 'next/dynamic';

const ServicesContent = dynamic(() => import("@/components/ui/ServicesSection"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-background pt-32 pb-24"><div className="container mx-auto px-6">Loading...</div></div>
});

export default function ServicesPageWrapper() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6">
        <ServicesContent />
      </div>
    </div>
  );
}