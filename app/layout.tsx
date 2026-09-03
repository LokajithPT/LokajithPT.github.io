import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LokajithPT — making questionable decisions and pushing to prod",
  description:
    "Portfolio of LokajithPT — builder of gilma, lkey, leviathan. Making questionable decisions and pushing to prod since forever.",
  openGraph: {
    title: "LokajithPT",
    description: "making questionable decisions and pushing to prod",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-zinc-100 selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
