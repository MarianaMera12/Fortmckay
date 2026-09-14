import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fort McKay First Nation — Fitness Centre",
  description: "Class schedule, reservations and gym management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
