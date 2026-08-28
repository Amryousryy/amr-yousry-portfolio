import { pageview, event } from "@/lib/analytics";

const SCROLL_DEPTHS = [25, 50, 75, 100];
const SESSION_MARKS_SECONDS = [15, 30, 60, 120];

let booted = false;

function defineGtagShim(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(args);
  };
}

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

function installScrollDepthTracking(): void {
  const reported = new Set<number>();

  const onScroll = () => {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const depth = Math.round((window.scrollY / maxScroll) * 100);

    for (const threshold of SCROLL_DEPTHS) {
      if (depth >= threshold && !reported.has(threshold)) {
        reported.add(threshold);
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
}

function installSessionMarkTracking(): void {
  const reported = new Set<number>();

  for (const seconds of SESSION_MARKS_SECONDS) {
    window.setTimeout(() => {
      if (reported.has(seconds)) return;
      reported.add(seconds);
      event("session_duration", { seconds });
    }, seconds * 1000);
  }
}

function installOutboundClickTracking(): void {
  document.addEventListener(
    "click",
    (e: MouseEvent) => {
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      trackOutboundClick(anchor);
    },
    true
  );
}

export function bootGA(measurementId: string | undefined): void {
  if (booted) return;
  if (process.env.NODE_ENV !== "production") return;
  if (!measurementId || typeof window === "undefined") return;
  booted = true;

  defineGtagShim();

  window.gtag?.("js", new Date());
  window.gtag?.("config", measurementId, {
    send_page_view: false,
    anonymize_ip: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.onload = () => {
    pageview(`${window.location.pathname}${window.location.search}`);
  };
  document.head.appendChild(script);

  installScrollDepthTracking();
  installSessionMarkTracking();
  installOutboundClickTracking();
}