"use client";

import { useNotes } from "@/context/NotesContext";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function TimelinePage() {
    const { parsedWorks } = useNotes();

    const sortedWorks = useMemo(() => {
        return [...parsedWorks].sort((a, b) => a.year - b.year);
    }, [parsedWorks]);

    return (
        <main className="min-h-screen p-8 max-w-4xl mx-auto">
            <header className="mb-12">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </Link>
                <h1 className="text-4xl font-serif font-bold text-stone-800 text-center">
                    Literary Timeline
                </h1>
            </header>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-stone-200 transform -translate-x-1/2" />

                <div className="space-y-12">
                    {sortedWorks.map((work, index) => (
                        <motion.div
                            key={work.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative flex items-center md:justify-center"
                        >
                            {/* Year Bubble */}
                            <div className="absolute left-8 md:left-1/2 w-12 h-12 bg-amber-100 border-4 border-white rounded-full flex items-center justify-center text-sm font-bold text-amber-700 shadow-sm z-10 transform -translate-x-1/2">
                                {work.year}
                            </div>

                            {/* Content Card */}
                            <div className="ml-20 md:ml-0 md:w-1/2 md:pr-12 md:text-right md:absolute md:left-0">
                                {/* Mobile: Card is always right of line. Desktop: We need to alternate or keep consistent. 
                   User requirement: "Left side: Year bubble. Right side: Card with Title and Author."
                   Wait, "Left side: Year bubble" implies relative to the card? Or relative to the line?
                   "Central vertical line... Left side: Year bubble. Right side: Card"
                   This sounds like the year is on the left of the line, card on the right.
                   But for a central line, usually items alternate.
                   However, user said "Left side: Year bubble. Right side: Card".
                   Let's interpret this as: Year is ON the line or slightly left, Card is RIGHT of the line.
                   But if the line is central, this wastes the left space.
                   Let's stick to the user's specific request: "Nodes: Left side: Year bubble. Right side: Card".
                   This implies a layout where the line is maybe not central, or the content is all on the right.
                   BUT user also said "Central vertical line".
                   If the line is central, and cards are ALWAYS on the right, the left is empty.
                   Maybe they mean "Year on left of line, Card on right of line".
                   I will implement that.
                */}
                                <div className="hidden md:block" />
                            </div>

                            <div className="ml-20 md:ml-0 md:w-1/2 md:pl-12 flex-1">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-stone-800 font-serif mb-1">
                                        {work.title}
                                    </h3>
                                    <p className="text-stone-600 italic">
                                        {work.author}
                                    </p>
                                </div>
                            </div>

                            {/* Adjusting for the "Year on left" requirement with central line */}
                            {/* Actually, if the line is central, and year is "Left side", maybe year is on the left column, card on right column? */}
                            <div className="absolute left-8 md:left-1/2 transform -translate-x-[calc(100%+2rem)] md:-translate-x-[calc(100%+3rem)] hidden md:flex items-center justify-end w-32">
                                {/* This would put year on the far left. But the bubble is usually ON the line. */}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
