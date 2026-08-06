"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_MEASUREMENT_ID, pageview, event } from "@/lib/analytics";

const SCROLL_DEPTHS = [25, 50, 75, 100];
const SESSION_MARKS_SECONDS = [15, 30, 60, 120];

function trackOutboundClick(anchor: HTMLAnchorElement): void {
  const href = anchor.href;
  if (!href || !href.startsWith("http")) return;

  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return;
  }

  if (url.hostname === window.location.hostname) return;

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const linkText = (anchor.textContent || "").trim().slice(0, 120);
  const payload = { link_url: href, link_text: linkText };

  if (host.includes("wa.me") || host.includes("whatsapp")) {
    event("whatsapp_click", payload);
  } else if (host.includes("linkedin")) {
    event("linkedin_click", payload);
  } else if (host.includes("github")) {
    event("github_click", payload);
  } else {
    event("outbound_click", payload);
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const reportedScrollDepths = useRef(new Set<number>());
  const reportedSessionMarks = useRef(new Set<number>());

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      pageview(pathname + window.location.search);
    }, 100);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const onScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const depth = Math.round((window.scrollY / maxScroll) * 100);

      for (const threshold of SCROLL_DEPTHS) {
        if (depth >= threshold && !reportedScrollDepths.current.has(threshold)) {
          reportedScrollDepths.current.add(threshold);
          event("scroll_depth", { percent_scrolled: threshold });
        }
      }
    };

    let ticking = false;
    const onScrollRaf = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScrollRaf, { passive: true });
    return () => window.removeEventListener("scroll", onScrollRaf);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const timers = SESSION_MARKS_SECONDS.map((seconds) =>
      window.setTimeout(() => {
        if (reportedSessionMarks.current.has(seconds)) return;
        reportedSessionMarks.current.add(seconds);
        event("session_duration", { seconds });
      }, seconds * 1000)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      trackOutboundClick(anchor);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (process.env.NODE_ENV !== "production") return null;
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => pageview(window.location.pathname + window.location.search)}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false, anonymize_ip: true });
          `,
        }}
      />
    </>
  );
}
