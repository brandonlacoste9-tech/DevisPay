import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0C",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            width: 128,
            height: 128,
            borderRadius: 32,
            background:
              "linear-gradient(145deg, #FFD36A 0%, #F5B942 50%, #D4921A 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0A0A0C",
            fontSize: 72,
            fontWeight: 800,
          }}
        >
          D
        </div>
      </div>
    ),
    { ...size }
  );
}
