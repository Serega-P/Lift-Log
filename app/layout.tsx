import { Providers } from "@/components/shared/components";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "react-calendar/dist/Calendar.css";
import "./globals.css";
import "./styles/calendar.css";

const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  variable: "--font-rubik",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "LiftLog",
  description: "Your Growth Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><link rel="manifest" href="/manifest.json" /><meta name="theme-color" content="#000000" /></head>
      <body className={`${rubik.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}