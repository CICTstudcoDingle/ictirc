import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CICT — College of Information and Communication Technology | ISUFST";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1a1a2e 0%, #4a0000 50%, #1a1a2e 100%)",
          fontFamily: "Inter, system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Top decorative line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            CICT
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#D4AF37",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            College of Information and Communication Technology
          </div>

          {/* Divider */}
          <div
            style={{
              width: "120px",
              height: "3px",
              background: "#D4AF37",
              borderRadius: "4px",
            }}
          />

          {/* University */}
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
            }}
          >
            Iloilo State University of Fisheries Science and Technology
          </div>

          {/* Campus */}
          <div
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.5)",
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            Dingle Campus, Iloilo, Philippines
          </div>
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255, 255, 255, 0.6)",
              fontFamily: "monospace",
            }}
          >
            isufstcict.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
