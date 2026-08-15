import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kings Tamil Astro",
  description: "ஒரு பக்க ஜாதகம்"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ta">
      <body>{children}</body>
    </html>
  );
}
