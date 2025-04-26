import type { Metadata } from "next";
import "./globals.css";

import { Jura } from "next/font/google";

const jura = Jura({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memoria",
  description: "Study smarter, not harder.",
  icons: {
    icon: './favicon.ico',
    shortcut: './favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jura.className} flex flex-col min-h-screen w-full`}>
        {children}
      </body>
    </html>
  );
}
