"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "@/lib/tracker";
import { ArrowRight, Quote } from "lucide-react";
import type { ProjectMediaItem, KeyDecision, SocialProofItem, BeforeAfter, QuickFacts } from "@/types/project-static";
import ProjectMediaGallery from "@/components/projects/ProjectMediaGallery";
import { PixelButton } from "@/components/ui/pixel-button";

interface RelatedProjectItem {
  slug: string;
  title: string;
  category: string;
  thumbnail: string;
  summary: string;
}

interface CaseStudyClientProps {
  project: {
    problem?: string;
    solution?: string;
    execution?: string;
    mainResult?: string;
    outcomeNarrative?: string;
    detailedResults?: { label: string; value: string }[];
    keyDecisions?: KeyDecision[];
    quickFacts?: QuickFacts;
    beforeAfter?: BeforeAfter;
    socialProof?: SocialProofItem[];
    services?: string[];
    media?: ProjectMediaItem[];
    title: string;
  };
  relatedProjects: RelatedProjectItem[];
}

function ReadingCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="bg-[rgba(8,10,20,0.45)] border border-[rgba(255,255,255,0.05)] backdrop-blur-[12px] p-8 sm:p-10 md:p-14"
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-pixel text-brand-cyan text-[11px] sm:text-sm tracking-widest uppercase mb-6">
      {children}
    </h2>
  );
}

function NarrativeText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-modern text-base md:text-lg text-foreground/80 leading-[1.75] md:leading-[1.8]">
      {children}
    </p>
  );
}

function SectionSpacer() {
  return <div className="h-[80px] sm:h-[120px] md:h-[160px]" />;
}

function SpacerXl() {
  return <div className="h-[100px] sm:h-[140px] md:h-[180px]" />;
}

function SpacerSm() {
  return <div className="h-[60px] sm:h-[80px] md:h-[120px]" />;
}

function ChapterLabel({ number, question }: { number: string; question: string }) {
  return (
    <span className="font-pixel text-[10px] text-foreground/30 tracking-widest uppercase block mb-1">
      <span className="text-foreground/50">{number}</span> / {question}
    </span>
  );
}

function firstSentence(text: string): string {
  const parts = text.split(/[.!?]/).filter((s) => s.trim().length > 0);
  return parts.length > 0 ? parts[0].trim() + "." : text;
}

function restAfterFirstSentence(text: string): string {
  const idx = text.search(/[.!?]/);
  if (idx === -1 || idx + 1 >= text.length) return "";
  const rest = text.slice(idx + 1).trim();
  return rest.startsWith(".") ? rest.slice(1).trim() : rest;
}

export function CaseStudyClient({ project, relatedProjects }: CaseStudyClientProps) {
  const {
    problem, solution, execution, mainResult, outcomeNarrative,
    detailedResults, keyDecisions, quickFacts, beforeAfter, socialProof,
    services, media, title,
  } = project;

  const galleryItems = media ?? [];
  const hasOutcome = !!(outcomeNarrative || mainResult || (detailedResults && detailedResults.length > 0));
  const hasProblem = !!problem;
  const hasSolution = !!solution;
  const hasDecisions = !!(keyDecisions && keyDecisions.length > 0);
  const hasExecution = !!execution;
  const hasQuickFacts = !!quickFacts;
  const hasBeforeAfter = !!beforeAfter;
  const hasSocialProof = !!(socialProof && socialProof.length > 0);

  useEffect(() => {
    trackEvent("project_detail_view", {
      path: window.location.pathname,
      projectSlug: window.location.pathname.split("/").pop() || "",
    });
  }, []);

  return (
    <>
      <div className="mx-auto max-w-[760px]">
        {/* EXECUTIVE SUMMARY */}
        {hasQuickFacts && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)] mb-16 md:mb-24"
            >
              <FactCard question="Who was this created for?" answer={project.title} />
              <FactCard question="What problem needed solving?" answer={quickFacts!.challenge} />
              <FactCard question="What strategic direction was taken?" answer={quickFacts!.solution} />
              <FactCard question="What value was created?" answer={quickFacts!.outcome} />
            </motion.div>
          </>
        )}

        {/* OUTCOME — Chapter 1 */}
        {hasOutcome && (
          <ReadingCard>
            <ChapterLabel number="01" question="What was achieved?" />
            <SectionLabel>Outcome</SectionLabel>
            {outcomeNarrative && (
              <p
                className="font-modern text-lg md:text-xl text-white leading-[1.65] mb-8"
                style={{ textWrap: "balance" }}
              >
                {outcomeNarrative}
              </p>
            )}
            {!outcomeNarrative && mainResult && (
              <p
                className="font-modern text-lg md:text-xl text-white leading-[1.65] mb-8"
                style={{ textWrap: "balance" }}
              >
                {mainResult}
              </p>
            )}
            {detailedResults && detailedResults.length > 0 && (
              <div className="grid grid-cols-2 gap-8 sm:gap-10 border-t border-[rgba(255,255,255,0.06)] pt-8 mt-8">
                {detailedResults.map((r, i) => (
                  <div key={i}>
                    <span className="font-pixel text-2xl md:text-3xl text-white block leading-tight">
                      {r.value}
                    </span>
                    <span className="font-pixel text-[10px] text-text-dim tracking-wider uppercase mt-1.5 block">
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ReadingCard>
        )}

        {/* PROBLEM — Chapter 2 */}
        {hasProblem && (
          <>
            {hasOutcome && <SpacerXl />}
            <ReadingCard>
              <ChapterLabel number="02" question="What business challenge existed?" />
              <SectionLabel>Problem</SectionLabel>
              <NarrativeText>{problem}</NarrativeText>
            </ReadingCard>
          </>
        )}

        {/* SOLUTION — Chapter 3 */}
        {hasSolution && (
          <>
            {(hasOutcome || hasProblem) && <SectionSpacer />}
            <ReadingCard>
              <ChapterLabel number="03" question="How did we decide to solve it?" />
              <SectionLabel>Solution</SectionLabel>
              {(() => {
                const fs = firstSentence(solution!);
                const rest = restAfterFirstSentence(solution!);
                return (
                  <>
                    {fs && (
                      <p
                        className="font-modern text-lg md:text-xl text-white leading-[1.65] mb-5"
                        style={{ textWrap: "balance" }}
                      >
                        &ldquo;{fs}&rdquo;
                      </p>
                    )}
                    {rest && <NarrativeText>{rest}</NarrativeText>}
                  </>
                );
              })()}
            </ReadingCard>
          </>
        )}

        {/* KEY DECISIONS — Chapter 4 */}
        {hasDecisions && (
          <>
            {(hasOutcome || hasProblem || hasSolution) && <SpacerXl />}
            <ReadingCard>
              <ChapterLabel number="04" question="Why were these decisions made?" />
              <SectionLabel>Key Decisions</SectionLabel>
              <div className="space-y-12">
                {keyDecisions!.map((kd, i) => (
                  <div key={i}>
                    {i > 0 && <div className="border-t border-[rgba(255,255,255,0.06)] mb-10" />}
                    <div className="border-l-2 border-brand-cyan/30 pl-6 md:pl-8">
                      <h3 className="font-display text-base sm:text-lg text-white uppercase tracking-tight leading-tight mb-5">
                        {kd.decision}
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <span className="font-pixel text-[10px] text-brand-cyan/60 tracking-widest uppercase block mb-1.5">
                            Rationale
                          </span>
                          <p className="font-modern text-sm md:text-base text-foreground/70 leading-relaxed">
                            {kd.reason}
                          </p>
                        </div>

                        {kd.alternativeConsidered && (
                          <div className="pl-4 md:pl-6 border-l border-amber-400/20">
                            <span className="font-pixel text-[10px] text-amber-400/60 tracking-widest uppercase block mb-1.5">
                              Alternative Considered
                            </span>
                            <p className="font-modern text-sm md:text-base text-foreground/60 leading-relaxed">
                              {kd.alternativeConsidered}
                            </p>
                          </div>
                        )}

                        {kd.whyRejected && (
                          <div className="pl-4 md:pl-6 border-l border-red-400/20">
                            <span className="font-pixel text-[10px] text-red-400/50 tracking-widest uppercase block mb-1.5">
                              Why It Was Rejected
                            </span>
                            <p className="font-modern text-sm md:text-base text-foreground/60 leading-relaxed">
                              {kd.whyRejected}
                            </p>
                          </div>
                        )}

                        <div className="pl-4 md:pl-6 border-l border-brand-cyan/20">
                          <span className="font-pixel text-[10px] text-brand-cyan tracking-widest uppercase block mb-1.5">
                            Business Impact
                          </span>
                          <p className="font-modern text-sm md:text-base text-brand-cyan/80 leading-relaxed">
                            {kd.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ReadingCard>
          </>
        )}

        {/* CREATIVE PROCESS — Chapter 5 */}
        {hasExecution && (
          <>
            {(hasOutcome || hasProblem || hasSolution || hasDecisions) && <SpacerSm />}
            <ReadingCard>
              <ChapterLabel number="05" question="How was the idea brought to life?" />
              <SectionLabel>Creative Process</SectionLabel>
              {services && services.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {services.map((s) => (
                    <span
                      key={s}
                      className="font-pixel text-[9px] sm:text-[10px] text-brand-cyan/80 tracking-widest uppercase px-3 py-1.5 border border-brand-cyan/10 bg-brand-cyan/5 hover:border-brand-cyan/25 hover:bg-brand-cyan/10 transition-all duration-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {(() => {
                const steps = execution!.split(/\.\s+/).filter((s) => s.trim().length > 0);
                if (steps.length < 2) {
                  return <NarrativeText>{execution}</NarrativeText>;
                }
                return (
                  <div className="relative">
                    <div className="absolute left-[7px] top-3 bottom-3 w-px bg-[rgba(255,255,255,0.06)]" />
                    <div className="space-y-8">
                      {steps.map((step, idx) => (
                        <div key={idx} className="relative pl-8">
                          <span className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border border-brand-cyan/30 bg-background flex items-center justify-center">
                            <span className="text-[8px] font-pixel text-brand-cyan/60">{idx + 1}</span>
                          </span>
                          <p className="font-modern text-sm md:text-base text-foreground/70 leading-relaxed">
                            {step.trim()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </ReadingCard>
          </>
        )}
      </div>

      {/* BEFORE & AFTER */}
      {hasBeforeAfter && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="mt-24 md:mt-36"
        >
          <div className="mx-auto max-w-[760px]">
            <SectionLabel>Before & After</SectionLabel>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8">
            <div className="bg-[rgba(8,10,20,0.45)] border border-[rgba(255,255,255,0.05)] backdrop-blur-[12px] p-8 sm:p-10 md:p-14">
              <span className="font-pixel text-[10px] text-red-400/60 tracking-widest uppercase block mb-4">Before</span>
              {beforeAfter!.mediaBefore && (
                <div className="relative h-44 sm:h-52 mb-5 overflow-hidden">
                  <Image src={beforeAfter!.mediaBefore} alt="Before" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              )}
              <NarrativeText>{beforeAfter!.before}</NarrativeText>
            </div>
            <div className="bg-[rgba(8,10,20,0.45)] border border-[rgba(255,255,255,0.05)] backdrop-blur-[12px] p-8 sm:p-10 md:p-14">
              <span className="font-pixel text-[10px] text-brand-cyan tracking-widest uppercase block mb-4">After</span>
              {beforeAfter!.mediaAfter && (
                <div className="relative h-44 sm:h-52 mb-5 overflow-hidden">
                  <Image src={beforeAfter!.mediaAfter} alt="After" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              )}
              <NarrativeText>{beforeAfter!.after}</NarrativeText>
            </div>
          </div>
        </motion.div>
      )}

      {/* PROJECT MEDIA */}
      {galleryItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="mt-20 md:mt-28"
        >
          <SectionLabel>Project Media</SectionLabel>
          <ProjectMediaGallery items={galleryItems} title={title} />
        </motion.div>
      )}

      {/* RELATED PROJECTS */}
      {relatedProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="mt-16 md:mt-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-pixel text-brand-cyan text-[11px] sm:text-sm tracking-widest uppercase shrink-0">
              Related Projects
            </h2>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-5">
            {relatedProjects.map((rp) => (
              <Link
                key={rp.slug}
                href={`/projects/${rp.slug}`}
                className="group flex flex-col bg-[rgba(8,10,20,0.45)] border border-[rgba(255,255,255,0.05)] hover:border-brand-cyan/30 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-[4/3] shrink-0">
                  <Image
                    src={rp.thumbnail}
                    alt={rp.title}
                    fill
                    className="object-contain object-top transition-transform duration-700 group-hover:scale-102"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 pt-2 sm:pt-2 px-3 sm:px-3 pb-3 sm:pb-4">
                  <div>
                    <span className="font-pixel text-[10px] sm:text-[11px] text-brand-cyan tracking-widest uppercase block mb-2">
                      {rp.category}
                    </span>
                    <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase leading-tight tracking-tight mb-1.5">
                      {rp.title}
                    </h3>
                    <p className="font-modern text-xs text-foreground/60 leading-normal line-clamp-3">
                      {rp.summary}
                    </p>
                  </div>
                  <span className="font-pixel text-[10px] text-foreground/50 tracking-widest uppercase inline-flex items-center gap-1.5 self-start">
                    View Project
                    <ArrowRight size={10} className="text-foreground/50" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* SOCIAL PROOF */}
      {hasSocialProof && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="mt-24 md:mt-36 mx-auto max-w-[760px]"
        >
          <div className="bg-[rgba(8,10,20,0.45)] border border-[rgba(255,255,255,0.05)] backdrop-blur-[12px] p-8 sm:p-10 md:p-14">
            <SectionLabel>Recognition & Results</SectionLabel>
            <div className="space-y-5">
              {socialProof!.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  {item.type === "testimonial" ? (
                    <Quote size={16} className="text-brand-cyan/40 shrink-0 mt-0.5" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan/40 shrink-0 mt-2" />
                  )}
                  <div>
                    <p className="font-modern text-sm md:text-base text-foreground/80 leading-relaxed">
                      {item.type === "testimonial" && <span className="text-white">&ldquo;</span>}
                      {item.content}
                      {item.type === "testimonial" && <span className="text-white">&rdquo;</span>}
                    </p>
                    {item.source && (
                      <p className="font-pixel text-[10px] text-text-dim tracking-wider uppercase mt-1">
                        {item.source}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* FINAL CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="mt-20 md:mt-28 pt-16 md:pt-20 border-t border-[rgba(255,255,255,0.06)] text-center"
      >
        <p
          className="font-modern text-base text-foreground/50 leading-relaxed mb-4"
          style={{ textWrap: "balance" }}
        >
          Every successful project starts with a conversation.
        </p>
        <p
          className="font-modern text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 max-w-[560px] mx-auto"
          style={{ textWrap: "balance" }}
        >
          Inspired by this project? Let&apos;s create something exceptional together.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact#project-inquiry">
            <PixelButton className="px-8 py-3 text-sm active:scale-[0.97] transition-transform">
              Start Your Project <ArrowRight size={14} className="ml-1.5 inline-block" />
            </PixelButton>
          </Link>
          <Link href="/projects">
            <PixelButton variant="outline" className="px-8 py-3 text-sm active:scale-[0.97] transition-transform">
              View More Projects
            </PixelButton>
          </Link>
        </div>
      </motion.div>
    </>
  );
}

function FactCard({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-background p-5 sm:p-7">
      <span className="font-pixel text-[10px] sm:text-[11px] text-brand-cyan tracking-widest uppercase block mb-2">
        {question}
      </span>
      <span className="font-modern text-sm sm:text-base text-foreground/80 leading-relaxed block" style={{ textWrap: "balance" }}>
        {answer}
      </span>
    </div>
  );
}
