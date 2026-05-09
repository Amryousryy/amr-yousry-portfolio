import { ImageResponse } from "next/og";
import { getLogoSvgDataUri } from "@/lib/logo-data-uri";

export const alt = "Amr Yousry | Senior Multimedia Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const logoSrc = getLogoSvgDataUri();
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
          background:
            "linear-gradient(135deg, #0f0524 0%, #240e68 50%, #1a0a3e 100%)",
          padding: 60,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            width: 32,
            height: 32,
            borderTop: "3px solid #6ee0d7",
            borderLeft: "3px solid #6ee0d7",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            width: 32,
            height: 32,
            borderTop: "3px solid #6ee0d7",
            borderRight: "3px solid #6ee0d7",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            width: 32,
            height: 32,
            borderBottom: "3px solid #6ee0d7",
            borderLeft: "3px solid #6ee0d7",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            width: 32,
            height: 32,
            borderBottom: "3px solid #6ee0d7",
            borderRight: "3px solid #6ee0d7",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 60,
            right: 60,
            height: 1,
            background: "rgba(110, 224, 215, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 60,
            right: 60,
            height: 1,
            background: "rgba(110, 224, 215, 0.08)",
          }}
        />

        <img
          src={logoSrc}
          alt=""
          style={{ width: 110, height: 110, display: "block", marginBottom: 32 }}
        />

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

        <div
          style={{
            width: 160,
            height: 4,
            background: "#6ee0d7",
            borderRadius: 2,
            marginBottom: 20,
          }}
        />

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
          Cinematic visuals, brand systems, and digital experiences built for
          attention, trust, and conversion.
        </span>

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
