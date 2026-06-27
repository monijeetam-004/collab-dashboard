import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CollabSpace — Live Collaboration Dashboard",
  description: "A real-time collaboration dashboard with drag-and-drop, presence indicators, and command palette",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{children}</body>
    </html>
  );
}
