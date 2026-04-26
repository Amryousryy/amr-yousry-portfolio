import { Analytics } from "@vercel/analytics/next";

export default function AnalyticsProvider() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }
  return <Analytics />;
}