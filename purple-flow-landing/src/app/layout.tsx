import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Purple Flow Frozen Yogurt & Acai | Strathfield",
  description:
    "Fresh fruit toppings and lovely flavours at Purple Flow Frozen Yogurt and Acai in Strathfield Plaza. 4.7-star rated frozen yoghurt and acai bowls. Order collection or delivery.",
  keywords: [
    "frozen yogurt Strathfield",
    "acai bowls Strathfield",
    "froyo Sydney",
    "Purple Flow",
    "dessert Strathfield Plaza",
  ],
  openGraph: {
    title: "Purple Flow Frozen Yogurt & Acai | Strathfield",
    description:
      "Fresh fruit toppings, lovely flavours and generous portions. 4.7 stars on Google. Order collection or delivery.",
    type: "website",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#1a1523]">
        {children}
      </body>
    </html>
  );
}
