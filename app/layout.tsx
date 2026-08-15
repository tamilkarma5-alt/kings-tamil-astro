import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kings Tamil Astro",
  description: "South Indian Tamil Jathagam Generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ta"><body>{children}</body></html>;
}