import type { Metadata } from "next";
import TimelineContent from "./timeline-content";

export const metadata: Metadata = {
  title: "IT Through The Years",
  description:
    "Celebrating the legacy, leadership, and milestones of the CICT Student Council across academic years.",
};

export default function TimelinePage() {
  return <TimelineContent />;
}
