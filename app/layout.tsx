import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kings Tamil Astro",
  description: "Professional Tamil Jathagam Generator",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ta">
      <body>{children}</body>
    </html>
  );
}
