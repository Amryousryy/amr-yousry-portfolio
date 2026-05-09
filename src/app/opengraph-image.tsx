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
          flexDirection: "row",
          background:
            "linear-gradient(135deg, #0f0524 0%, #240e68 50%, #1a0a3e 100%)",
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
            width: "40%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px 0 48px",
          }}
        >
          <img
            src={logoSrc}
            alt=""
            style={{
              width: 280,
              height: 280,
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            width: "60%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px 0 24px",
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "monospace",
              letterSpacing: 4,
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            AMR YOUSRY
          </span>

          <div
            style={{
              width: 120,
              height: 4,
              background: "#6ee0d7",
              borderRadius: 2,
              marginBottom: 24,
            }}
          />

          <span
            style={{
              fontSize: 28,
              color: "#6ee0d7",
              fontFamily: "monospace",
              letterSpacing: 3,
              marginBottom: 20,
            }}
          >
            SENIOR MULTIMEDIA DESIGNER
          </span>

          <span
            style={{
              fontSize: 18,
              color: "#a0a0b0",
              fontFamily: "system-ui, sans-serif",
              lineHeight: 1.5,
              maxWidth: 520,
            }}
          >
            Cinematic visuals, brand systems, and digital experiences built for
            attention, trust, and conversion.
          </span>
        </div>

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
