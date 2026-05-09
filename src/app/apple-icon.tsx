import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#f5db0a",
            fontFamily: "monospace",
            lineHeight: 1,
            letterSpacing: 6,
          }}
        >
          A
        </span>
        <div
          style={{
            width: 80,
            height: 6,
            background: "#6ee0d7",
            marginTop: 12,
            borderRadius: 3,
          }}
        />
        <span
          style={{
            fontSize: 16,
            color: "#ffffff",
            fontFamily: "monospace",
            marginTop: 12,
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
