export default function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Amr Yousry",
    alternateName: "AMR YOUSRY CREATIVES",
    url: "https://amr-yousry-portfolio.vercel.app",
    knowsAbout: [
      "Creative Direction",
      "Video Production",
      "Motion Design",
      "UI/UX Design",
      "Content Creation",
      "Brand Storytelling",
    ],
    description:
      "Multidisciplinary creative specializing in cinematic visuals, brand systems, and digital experiences.",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AMR YOUSRY CREATIVES",
    url: "https://amr-yousry-portfolio.vercel.app",
    description:
      "Cinematic visuals, brand systems, and digital experiences built for attention, trust, and conversion.",
    author: {
      "@type": "Person",
      name: "Amr Yousry",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
