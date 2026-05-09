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
          alignItems: "center",
          justifyContent: "center",
          background: "#240e68",
          borderRadius: 32,
        }}
      >
        <img
          src={logoSrc}
          alt=""
          style={{ width: 150, height: 150, display: "block" }}
        />
      </div>
    ),
    { ...size },
  );
}
