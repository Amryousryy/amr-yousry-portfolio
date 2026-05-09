import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#f5db0a",
            fontFamily: "monospace",
            lineHeight: 1,
          }}
        >
          A
        </span>
        <div
          style={{
            position: "absolute",
            bottom: 4,
            right: 4,
            width: 6,
            height: 6,
            background: "#6ee0d7",
            borderRadius: 1,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
