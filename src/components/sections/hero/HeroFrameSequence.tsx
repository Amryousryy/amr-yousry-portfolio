"use client";

import { useEffect, useRef } from "react";

/**
 * V1.1-E scroll-driven frame sequence.
 *
 * Source of truth: public/hero/f (copied byte-for-byte from C:\web\hero\f).
 * Measured facts, verified by header parse + full decode of all 187 frames:
 *   - 187 PNGs named "hero _NNNNN.png", contiguous 00025..00211, 5-digit pad
 *     (the space before the underscore is real and is preserved on disk)
 *   - every frame exactly 1920x1080, colour type 6 (RGBA), 8-bit, not interlaced
 *   - all four corners fully transparent on every frame => real alpha, no plate
 *   - character occupies y 153..935 and x 737..1079 of the 1920x1080 canvas
 *
 * Because every frame shares one identical canvas, that canvas is used as the
 * canonical coordinate system. Frames are never re-centred on their own visible
 * pixels - doing so would make the character jump horizontally as the arms,
 * camera and tablet swing through the rotation.
 */

const FRAME_DIR = "/hero/f";
const FRAME_START = 25;
const FRAME_COUNT = 187;
const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;
const FRAME_ASPECT = FRAME_WIDTH / FRAME_HEIGHT;

/**
 * Decoded RGBA cost is 1920 * 1080 * 4 = 8.29 MB per frame, so holding all 187
 * simultaneously would cost ~1.55 GB. The decoded working set is therefore
 * capped by a measured byte budget rather than a frame count.
 */
const BYTES_PER_FRAME = FRAME_WIDTH * FRAME_HEIGHT * 4;
const DESKTOP_CACHE_BYTES = 176 * 1024 * 1024;
const MOBILE_CACHE_BYTES = 88 * 1024 * 1024;

/** Frames either side of the cursor that are decoded ahead of the play head. */
const PREFETCH_RADIUS = 10;
/** Concurrent network+decode operations, so decoding never saturates the thread. */
const MAX_PARALLEL_FETCHES = 6;

/**
 * Rendering interpolation is deliberate, not automatic. A 160x120 torso crop
 * contains 7228 distinct RGBA values, which means these frames carry
 * anti-aliased edges rather than hard-edged pixel blocks. Nearest-neighbour
 * downscaling that source aliases and shimmers, so high-quality smoothing is
 * used for the 1920 -> display downscale. Flip this single constant to compare.
 */
const USE_SMOOTH_SCALING = true;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

const frameName = (index: number) =>
  `hero _${String(FRAME_START + index).padStart(5, "0")}.png`;

/** The filename contains a space, so it must be percent-encoded in the URL. */
const frameUrl = (index: number) =>
  `${FRAME_DIR}/${encodeURIComponent(frameName(index))}`;

const FIRST_FRAME_URL = frameUrl(0);

export interface HeroFrameSequenceProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<HTMLDivElement | null>;
}

export function HeroFrameSequence({ trackRef, stageRef }: HeroFrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!canvas || !box || !track || !stage) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const isMobile = () => window.innerWidth < 768;
    const byteBudget = () =>
      isMobile() ? MOBILE_CACHE_BYTES : DESKTOP_CACHE_BYTES;

    /** decoded working set - bounded, LRU by distance from the play head */
    const decoded = new Map<number, ImageBitmap>();
    /** downloaded but not yet decoded - bounded, ~190 KB per frame */
    const blobs = new Map<number, Blob>();
    /** frames that failed to load, so the background sweep never retries them */
    const failed = new Set<number>();
    const inflight = new Set<number>();
    let decodedBytes = 0;

    let playHead = 0;
    let lastDrawn = -1;
    let direction: 1 | -1 | 0 = 0;
    let raf = 0;
    let trackTop = 0;
    let travel = 1;
    let disposed = false;
    let canvasPainted = false;

    const onCanvasPainted = () => {
      if (canvasPainted) return;
      canvasPainted = true;
      box.classList.add("hero-frames--painted");
    };

    const setCanvasSurface = () => {
      const boxW = box.clientWidth;
      const boxH = box.clientHeight;
      if (boxW <= 0 || boxH <= 0) return false;

      // Height-priority fit: the canvas is 87% empty horizontally, so letting it
      // exceed the box width and clipping the sides wastes far less space than a
      // strict "contain" fit, which would shrink the character on narrow screens.
      // The character sits at x 737..1079 of 1920, close to centre, so the
      // clipped margins never touch it.
      const h = boxH;
      const w = h * FRAME_ASPECT;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bw = Math.round(w * dpr);
      const bh = Math.round(h * dpr);

      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.imageSmoothingEnabled = USE_SMOOTH_SCALING;
      ctx.imageSmoothingQuality = USE_SMOOTH_SCALING ? "high" : "low";
      return true;
    };

    const paint = (bitmap: ImageBitmap) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      onCanvasPainted();
    };

    /** Draw the closest already-decoded frame so the character never disappears. */
    const nearestDecoded = (target: number) => {
      if (decoded.size === 0) return null;
      let best = -1;
      let bestDistance = Infinity;
      for (const index of decoded.keys()) {
        const distance = Math.abs(index - target);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      }
      return best;
    };

    const render = () => {
      if (!setCanvasSurface()) return;

      if (reducedMotion.matches) {
        // Reduced motion: a stable single state, never scrubbed.
        const first = decoded.get(0) ?? null;
        if (first) {
          paint(first);
          lastDrawn = 0;
        }
        return;
      }

      if (lastDrawn === playHead && canvasPainted) return;

      const target = decoded.has(playHead) ? playHead : nearestDecoded(playHead);
      if (target === null) return;

      const bitmap = decoded.get(target);
      if (!bitmap) return;

      paint(bitmap);
      lastDrawn = target;
    };

    const measure = () => {
      trackTop = track.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
    };

    const progressFromScroll = () => {
      if (travel <= 0) return 0;
      return clamp01((window.scrollY - trackTop) / travel);
    };

    /** Deterministic mapping required by the brief: round(p * (N - 1)). */
    const frameFromProgress = (progress: number) =>
      Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(progress * (FRAME_COUNT - 1))));

    const scheduleRender = () => {
      if (raf || disposed) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = frameFromProgress(progressFromScroll());
        if (next !== playHead) {
          direction = next > playHead ? 1 : next < playHead ? -1 : 0;
          playHead = next;
        }
        render();
        pump(playHead);
      });
    };

    /**
     * Enforced by the measured byte budget rather than a frame count: evict
     * whichever decoded frame is furthest from the play head, never the play
     * head itself. The working set therefore tracks the user instead of growing.
     */
    const evict = () => {
      const budget = byteBudget();
      while (decoded.size > 1 && decodedBytes > budget) {
        let victim = -1;
        let worst = -1;
        for (const index of decoded.keys()) {
          if (index === playHead) continue;
          const distance = Math.abs(index - playHead);
          if (distance > worst) {
            worst = distance;
            victim = index;
          }
        }
        if (victim === -1) break;
        const bitmap = decoded.get(victim);
        decoded.delete(victim);
        decodedBytes -= BYTES_PER_FRAME;
        bitmap?.close();
      }
    };

    const decode = async (index: number) => {
      try {
        let blob = blobs.get(index);
        if (!blob) {
          const response = await fetch(frameUrl(index), { cache: "force-cache" });
          if (!response.ok) throw new Error(`frame ${index}: HTTP ${response.status}`);
          blob = await response.blob();
          blobs.set(index, blob);
        }
        const bitmap = await createImageBitmap(blob);
        if (disposed) {
          bitmap.close();
          return;
        }
        decoded.set(index, bitmap);
        decodedBytes += BYTES_PER_FRAME;
        failed.delete(index);
        evict();
        render();
      } catch {
        // A failed frame must never block the sequence; the play head simply
        // falls back to the nearest frame that did decode. Marking it permanently
        // stops the background sweep from retrying a 404 forever.
        blobs.delete(index);
        failed.add(index);
      } finally {
        inflight.delete(index);
        // Keep the pipeline saturated toward the current play head. Without this,
        // a saturated queue frees a slot with nothing left to schedule until the
        // next scroll event, which leaves a stale frame on screen once the user
        // stops scrolling.
        pump(playHead);
      }
    };

    const request = (index: number) => {
      if (disposed) return;
      if (index < 0 || index >= FRAME_COUNT) return;
      if (decoded.has(index) || inflight.has(index)) return;
      if (failed.has(index)) return;
      if (inflight.size >= MAX_PARALLEL_FETCHES) return;
      inflight.add(index);
      void decode(index);
    };

    /**
     * Priority order: play head, then adjacent frames biased toward the scroll
     * direction, then outward to the whole sequence so fast scrolling is ready.
     */
    const pump = (current: number) => {
      if (reducedMotion.matches) {
        request(0);
        return;
      }
      request(current);

      const slot = () => inflight.size < MAX_PARALLEL_FETCHES;
      for (let d = 1; d <= PREFETCH_RADIUS && slot(); d++) {
        if (direction >= 0) request(current + d);
        if (direction <= 0) request(current - d);
      }
      for (let d = PREFETCH_RADIUS + 1; d < FRAME_COUNT && slot(); d++) {
        if (direction >= 0) request(current + d);
        if (direction <= 0) request(current - d);
      }
    };

    /** Decode the first frame ahead of everything else for a non-blank hero. */
    const bootstrap = async () => {
      try {
        const response = await fetch(FIRST_FRAME_URL, { cache: "force-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        blobs.set(0, blob);
        const bitmap = await createImageBitmap(blob);
        if (disposed) {
          bitmap.close();
          return;
        }
        decoded.set(0, bitmap);
        decodedBytes += BYTES_PER_FRAME;
        paint(bitmap);
        lastDrawn = 0;
        onCanvasPainted();
      } catch {
        // The <img> placeholder already shows frame 0 in markup.
      }
    };

    const onScroll = () => scheduleRender();
    const onResize = () => {
      measure();
      scheduleRender();
    };

    measure();

    if (!reducedMotion.matches) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
    }
    reducedMotion.addEventListener("change", onResize);

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(box);
    resizeObserver.observe(track);

    void bootstrap();
    pump(playHead);
    render();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reducedMotion.removeEventListener("change", onResize);
      resizeObserver.disconnect();
      for (const bitmap of decoded.values()) bitmap.close();
      decoded.clear();
      blobs.clear();
    };
  }, [trackRef, stageRef]);

  return (
    <div ref={boxRef} className="hero-frames" data-hero-frames>
      {/* Single-element first-frame paint so the hero is never blank before the
          canvas decodes. Hidden by CSS once the canvas has painted, so it can
          never ghost behind a later frame. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- deliberate: a raw
          img paints frame 0 from the HTTP cache with no optimizer round-trip,
          and is removed by CSS the moment the canvas paints. next/image would
          add latency exactly where this hero needs to be non-blank. */}
      <img
        className="hero-frames-placeholder"
        src={FIRST_FRAME_URL}
        alt=""
        aria-hidden="true"
        decoding="async"
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        className="hero-frames-canvas"
        role="presentation"
        aria-hidden="true"
      />
    </div>
  );
}
