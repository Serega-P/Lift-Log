import { Providers } from "@/components/shared/components";
import type { Metadata } from "next";
import {Rubik} from "next/font/google";
import "react-calendar/dist/Calendar.css";
<<<<<<< HEAD
=======
import "./styles/calendar.css";
>>>>>>> 95a5d6c282f7157bde0eaf63dd1b509c73ffbfe4
import "./globals.css";
import "./styles/calendar.css";

const rubik = Rubik({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-rubik',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
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
      <body
        className={`${rubik.variable} antialiased`} >
<<<<<<< HEAD
					<Providers>{children}</Providers>
=======
        {children}
>>>>>>> 95a5d6c282f7157bde0eaf63dd1b509c73ffbfe4
      </body>
    </html>
  );
}
