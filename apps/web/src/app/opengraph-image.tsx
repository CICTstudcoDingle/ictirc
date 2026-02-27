/* eslint-disable react/forbid-component-props */
/* eslint-disable @next/next/no-img-element */
// NOTE: next/og ImageResponse uses Satori under the hood, which ONLY supports
// inline styles. External CSS or Tailwind classes are NOT supported here.
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "IRJICT - International Research Journal on Information and Communications Technology";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #800000 0%, #4a0000 60%, #1a0000 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative top-right circle */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            display: "flex",
          }}
        />
        {/* Decorative bottom-left circle */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            display: "flex",
          }}
        />

        {/* Gold top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #d4af37, #f0d060, #d4af37)",
            display: "flex",
          }}
        />

        {/* ISSN badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(212, 175, 55, 0.2)",
            border: "1px solid rgba(212, 175, 55, 0.5)",
            borderRadius: 999,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 8,
            paddingBottom: 8,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              color: "#d4af37",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 2,
              fontFamily: "sans-serif",
            }}
          >
            ISSN 2960-3773
          </span>
        </div>

        {/* Main acronym */}
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: -2,
            fontFamily: "sans-serif",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          IRJICT
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "#d4af37",
            borderRadius: 2,
            marginBottom: 24,
            display: "flex",
          }}
        />

        {/* Full name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.90)",
              fontSize: 26,
              fontWeight: 500,
              fontFamily: "sans-serif",
              textAlign: "center",
              letterSpacing: 0.5,
            }}
          >
            International Research Journal on
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.90)",
              fontSize: 26,
              fontWeight: 500,
              fontFamily: "sans-serif",
              textAlign: "center",
              letterSpacing: 0.5,
            }}
          >
            Information and Communications Technology
          </span>
        </div>

        {/* Footer publisher */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 18,
              fontFamily: "sans-serif",
              letterSpacing: 1,
            }}
          >
            ISUFST · College of Information and Computing Technology
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
