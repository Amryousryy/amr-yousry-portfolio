import { ImageResponse } from "next/og";
import { getLogoSvgDataUri } from "@/lib/logo-data-uri";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          background: "#240e68",
          borderRadius: 32,
        }}
      >
        <img
          src={logoSrc}
          alt=""
          style={{ width: 90, height: 90, display: "block" }}
        />
        <div
          style={{
            width: 80,
            height: 6,
            background: "#6ee0d7",
            marginTop: 16,
            borderRadius: 3,
          }}
        />
        <span
          style={{
            fontSize: 16,
            color: "#ffffff",
            fontFamily: "monospace",
            marginTop: 14,
            letterSpacing: 2,
          }}
        >
          YOUSRY
        </span>
      </div>
    ),
    { ...size },
  );
}
