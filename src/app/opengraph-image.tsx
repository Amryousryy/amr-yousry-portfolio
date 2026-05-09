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
            width: 630,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 500,
              height: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(15, 5, 36, 0.6)",
              border: "2px solid rgba(110, 224, 215, 0.25)",
              borderRadius: 40,
            }}
          >
            <img
              src={logoSrc}
              alt=""
              style={{
                width: 400,
                height: 400,
                display: "block",
              }}
            />
          </div>
        </div>

        <div
          style={{
            width: 570,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: 64,
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
              maxWidth: 480,
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
