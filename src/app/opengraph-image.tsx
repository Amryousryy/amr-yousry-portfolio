import { ImageResponse } from "next/og";

export const alt = "Amr Yousry | Senior Multimedia Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0524 0%, #240e68 50%, #1a0a3e 100%)",
          padding: 60,
          position: "relative",
        }}
      >
        {/* Decorative corner brackets */}
        <div style={{ position: "absolute", top: 24, left: 24, width: 32, height: 32, borderTop: "3px solid #6ee0d7", borderLeft: "3px solid #6ee0d7", borderRadius: 6 }} />
        <div style={{ position: "absolute", top: 24, right: 24, width: 32, height: 32, borderTop: "3px solid #6ee0d7", borderRight: "3px solid #6ee0d7", borderRadius: 6 }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 32, height: 32, borderBottom: "3px solid #6ee0d7", borderLeft: "3px solid #6ee0d7", borderRadius: 6 }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 32, height: 32, borderBottom: "3px solid #6ee0d7", borderRight: "3px solid #6ee0d7", borderRadius: 6 }} />

        {/* Grid line accents */}
        <div style={{ position: "absolute", top: 80, left: 60, right: 60, height: 1, background: "rgba(110, 224, 215, 0.08)" }} />
        <div style={{ position: "absolute", bottom: 80, left: 60, right: 60, height: 1, background: "rgba(110, 224, 215, 0.08)" }} />

        {/* Logo mark - yellow pixel box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            background: "#f5db0a",
            borderRadius: 16,
            marginBottom: 28,
            border: "4px solid #6ee0d7",
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: "#240e68",
              fontFamily: "monospace",
              lineHeight: 1,
            }}
          >
            A
          </span>
        </div>

        {/* Title */}
        <span
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "monospace",
            letterSpacing: 4,
            marginBottom: 16,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          AMR YOUSRY
        </span>

        {/* Cyan divider */}
        <div
          style={{
            width: 160,
            height: 4,
            background: "#6ee0d7",
            borderRadius: 2,
            marginBottom: 20,
          }}
        />

        {/* Role subtitle */}
        <span
          style={{
            fontSize: 24,
            color: "#6ee0d7",
            fontFamily: "monospace",
            letterSpacing: 3,
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          SENIOR MULTIMEDIA DESIGNER
        </span>

        {/* Tagline */}
        <span
          style={{
            fontSize: 16,
            color: "#a0a0b0",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            maxWidth: 640,
            lineHeight: 1.6,
          }}
        >
          Cinematic visuals, brand systems, and digital experiences built for attention, trust, and conversion.
        </span>

        {/* Bottom gradient bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #f5db0a, #6ee0d7, #784ad1)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
