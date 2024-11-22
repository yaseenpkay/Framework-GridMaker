import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Importing custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the app
export const metadata: Metadata = {
  title: "GridMaker - Framework",
  description:
    "GridMaker: A tool to create grids for artists, customize canvas size, upload and edit images, and more.",
  keywords: "GridMaker, grid tool, artist tools, image editor, canvas grids",
  openGraph: {
    title: "GridMaker - Framework",
    description:
      "A professional grid-making tool for artists with advanced image editing features.",
    url: "https://yourwebsite.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GridMaker - Framework",
      },
    ],
  },
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
