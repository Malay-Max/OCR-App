import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Chronology - Master Historical Timeline",
    description: "Learn and master chronological events through interactive timelines, drag-and-drop activities, and quizzes.",
    keywords: ["chronology", "timeline", "learning", "history", "education", "quiz"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <body className="font-sans antialiased min-h-screen">
                {children}
            </body>
        </html>
    );
}
