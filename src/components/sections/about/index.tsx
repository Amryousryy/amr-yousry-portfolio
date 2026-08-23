import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { aboutContent as staticAboutContent } from "@/content/about";
import { normalizeAboutContent, type PublicAboutContent } from "@/lib/about-content-normalizer";
import AboutLeft from "./about-left";
import AboutSkills from "./about-skills";
import AboutStats from "./about-stats";
import CharacterSelector from "./CharacterSelector";

interface AboutSectionProps {
  aboutData?: PublicAboutContent;
}

export default function AboutSection({ aboutData }: AboutSectionProps) {
  const aboutContent = normalizeAboutContent(aboutData, staticAboutContent);

  return (
    <Section id="about" className="relative py-14 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/3 via-transparent to-surface/98 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-pink/15 to-transparent pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">

          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="max-w-[620px]">
              <AboutLeft content={aboutContent} />
            </div>

            <div className="flex sm:grid sm:grid-cols-2 gap-4 pt-4 w-full max-w-[620px] overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
              <AboutSkills clusters={aboutContent.skillClusters} industries={aboutContent.industries} />
            </div>
          </div>

          <aside className="lg:col-span-5 flex flex-col space-y-6 h-full">
            <div className="space-y-0">
              <AboutStats stats={aboutContent.stats} />
            </div>

            <div
              className="relative group w-full aspect-[950/1187] min-h-[300px] md:min-h-[520px]"
            >
              <div className="relative w-full h-full bg-panel-soft border-2 border-line p-4 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(var(--color-brand-cyan) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                <CharacterSelector />
              </div>
            </div>
          </aside>

        </div>
      </Container>
    </Section>
  );
}
