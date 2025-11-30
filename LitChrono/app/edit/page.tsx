"use client";

import { useNotes } from "@/context/NotesContext";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPage() {
    const { rawData, updateNotes } = useNotes();
    const [content, setContent] = useState(rawData);
    const [parsedCount, setParsedCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        setContent(rawData);
    }, [rawData]);

    useEffect(() => {
        // Simple client-side count for immediate feedback
        const matches = content.match(/^-\s*(.+?)\s*\((\d{4})\)$/gm);
        setParsedCount(matches ? matches.length : 0);
    }, [content]);

    const handleSave = async () => {
        await updateNotes(content);
        router.push("/");
    };

    return (
        <main className="min-h-screen p-8 max-w-5xl mx-auto flex flex-col h-screen">
            <header className="flex items-center justify-between mb-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                        {parsedCount} works detected
                    </span>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
                    >
                        <Save size={18} />
                        <span>Save Notes</span>
                    </button>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 relative"
            >
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full p-6 text-lg font-mono leading-relaxed bg-white border border-stone-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                    placeholder="## Author Name&#10;- Work Title (Year)&#10;- Another Work (Year)"
                    spellCheck={false}
                />
            </motion.div>
        </main>
    );
}
