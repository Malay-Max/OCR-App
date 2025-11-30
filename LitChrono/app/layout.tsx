import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { NotesProvider } from "@/context/NotesContext";
import clsx from "clsx";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "LitChrono",
  description: "Chronology study tool for English Literature",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          inter.variable,
          merriweather.variable,
          "antialiased bg-background text-foreground font-sans"
        )}
      >
        <NotesProvider>{children}</NotesProvider>
      </body>
    </html>
  );
}
