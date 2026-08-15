import type { Metadata } from "next"; import "./globals.css";
export const metadata: Metadata={title:"Kings Tamil Astro",description:"தமிழ் ஜாதக அறிக்கை"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ta"><body>{children}</body></html>}