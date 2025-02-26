"use client";

import { Providers } from "@/components/shared/components";
import { Rubik } from "next/font/google";
import "react-calendar/dist/Calendar.css";
import "./globals.css";
import "./styles/calendar.css";
import { useEffect } from "react";

const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  variable: "--font-rubik",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("Service Worker зарегистрирован"))
        .catch((err) => console.error("Ошибка Service Worker:", err));
    }
  }, []);

  return (
    <html lang="en">
      <head><link rel="manifest" href="/manifest.json" /><meta name="theme-color" content="#000000" /></head>
      <body className={`${rubik.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
