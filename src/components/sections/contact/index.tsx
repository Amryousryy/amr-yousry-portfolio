import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { contactContent as staticContactContent } from "@/content/contact";
import ContactLeft from "./contact-left";
import ContactForm from "./ContactForm";
import type { PublicContactContent } from "@/lib/contact-content-normalizer";

interface ContactSectionProps {
  contactData?: PublicContactContent;
}

export default function ContactSection({ contactData }: ContactSectionProps) {
  const contactContent = contactData
    ? {
        ...staticContactContent,
        heading: contactData.heading || staticContactContent.heading,
        subheading: contactData.subheading || staticContactContent.subheading,
        availability: contactData.availability || staticContactContent.availability,
        socials: contactData.socials,
        whatsapp: { ...staticContactContent.whatsapp, number: contactData.whatsappNumber },
      }
    : staticContactContent;

  return (
    <Section id="contact" className="relative pb-16 sm:pb-36 pt-14 sm:pt-20 md:pt-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface/95 via-brand-cyan/2 to-surface/95 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/25 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <ContactLeft
            content={{
              heading: contactContent.heading,
              subheading: contactContent.subheading,
              availability: contactContent.availability,
            }}
            email={contactData?.email}
            whatsappNumber={contactData?.whatsappNumber}
            socials={contactData?.socials}
          />

          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
