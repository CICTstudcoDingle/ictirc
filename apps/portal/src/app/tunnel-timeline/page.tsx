import type { Metadata } from "next";
import TunnelTimelineContent from "./tunnel-timeline-content";

export const metadata: Metadata = {
  title: "3D Timeline Experience",
  description:
    "Navigate through the milestones of CICT in an immersive 3D tunnel experience.",
};

export default function TunnelTimelinePage() {
  return <TunnelTimelineContent />;
}
