import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kings Tamil Astro",
  description: "தமிழ் ஜாதகம் உருவாக்கும் கருவி",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ta">
      <body>{children}</body>
    </html>
  );
}