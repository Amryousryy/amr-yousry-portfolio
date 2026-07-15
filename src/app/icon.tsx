/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getLogoSvgDataUri } from "@/lib/logo-data-uri";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
        }}
      >
        <img
          src={logoSrc}
          alt=""
          style={{ width: 30, height: 30, display: "block" }}
        />
      </div>
    ),
    { ...size },
  );
}
