import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DevisPay — Get paid to start";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050506",
          padding: "64px 72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            left: "30%",
            width: 520,
            height: 320,
            background:
              "radial-gradient(circle, rgba(245,185,66,0.28) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background:
                "linear-gradient(145deg, #FFD36A 0%, #F5B942 50%, #D4921A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0A0A0C",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            D
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: -1.5,
              color: "#FAFAFA",
            }}
          >
            Devis
            <span style={{ color: "#F5B942" }}>Pay</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: -2.5,
              lineHeight: 1.05,
              color: "#FFFFFF",
            }}
          >
            Get paid to{" "}
            <span style={{ color: "#F5B942", marginLeft: 16 }}>start.</span>
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#A1A1AA" }}>
            Quote → one link → deposit. Card or bank. Global.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            color: "#71717A",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          devispay.com
        </div>
      </div>
    ),
    { ...size }
  );
}
