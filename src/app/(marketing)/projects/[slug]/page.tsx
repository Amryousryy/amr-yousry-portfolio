import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { projects } from "@/data/projects";
import { BackButton } from "@/components/layout/back-button";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const resolvedParams = await params;
  const project = projects.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="pb-32">
      {/* Hero Section */}
      <Section className="pt-8 md:pt-16 pb-16">
        <Container>
          <BackButton />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <span className="font-pixel text-brand-cyan text-sm tracking-widest mb-4 block">
                PROJECT LOG: {project.category}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-8 leading-[1.1] tracking-tight">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-3 mb-8">
                {project.services.map((service) => (
                  <span 
                    key={service} 
                    className="border border-slate-800 bg-slate-900/50 px-4 py-2 text-[10px] font-modern tracking-widest text-text-dim uppercase"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <div className="inline-block border-l-4 lg:border-l-0 lg:border-r-4 border-brand-cyan pl-6 lg:pl-0 lg:pr-6 py-2">
                <span className="font-pixel text-text-dim text-[10px] block mb-1 tracking-widest uppercase">Key Outcome</span>
                <span className="font-pixel text-3xl md:text-4xl lg:text-5xl text-white block">{project.mainResult}</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Banner Image */}
      <Container className="mb-24">
        <div className="relative aspect-[21/9] w-full border-4 border-slate-800 overflow-hidden pixel-shadow">
          <Image
            src={project.bannerImage}
            alt={project.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </Container>

      {/* The Story */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* Summary & Client Info */}
          <aside className="lg:col-span-4 space-y-12">
            <div>
              <h3 className="font-pixel text-sm text-brand-cyan mb-4">CLIENT</h3>
              <p className="font-modern text-2xl text-white">{project.client}</p>
            </div>
            <div>
              <h3 className="font-pixel text-sm text-brand-cyan mb-4">SUMMARY</h3>
              <p className="font-modern text-lg text-text-dim leading-relaxed">
                {project.summary}
              </p>
            </div>
          </aside>

          {/* Detailed Content */}
          <div className="lg:col-span-8 space-y-24">
            <div className="space-y-6">
              <h2 className="text-4xl font-pixel uppercase">01. The Problem</h2>
              <div className="w-16 h-1 bg-brand-cyan mb-8" />
              <p className="font-modern text-xl text-text-dim leading-relaxed antialiased">
                {project.problem}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-pixel uppercase">02. The Idea</h2>
              <div className="w-16 h-1 bg-brand-cyan mb-8" />
              <p className="font-modern text-xl text-text-dim leading-relaxed antialiased">
                {project.idea}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-pixel uppercase">03. Execution</h2>
              <div className="w-16 h-1 bg-brand-cyan mb-8" />
              <p className="font-modern text-xl text-text-dim leading-relaxed antialiased">
                {project.execution}
              </p>
            </div>

            <div className="pt-16 border-t border-slate-800">
              <h2 className="text-4xl font-pixel uppercase mb-12">04. Final Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {project.detailedResults.map((result) => (
                  <div key={result.label} className="bg-slate-900/50 p-6 border border-slate-800">
                    <span className="font-pixel text-[10px] text-brand-cyan block mb-2">{result.label}</span>
                    <span className="font-pixel text-3xl text-white">{result.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
