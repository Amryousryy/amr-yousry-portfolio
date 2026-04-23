"use client";

import dynamic from 'next/dynamic';

const ContactContent = dynamic(() => import("@/components/ui/ContactSection"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-background pt-32 pb-24"><div className="container mx-auto px-6">Loading...</div></div>
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6">
        <ContactContent />
      </div>
    </div>
  );
}