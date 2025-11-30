"use client";

import { useNotes, Work } from "@/context/NotesContext";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface QuestionData {
    question: Work;
    options: number[];
    answer: number;
}

export default function DateQuizPage() {
    const { parsedWorks } = useNotes();
    const [data, setData] = useState<QuestionData | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchQuestion = async () => {
        if (parsedWorks.length === 0) return;

        setLoading(true);
        setSelectedOption(null);

        try {
            const response = await fetch("/api/quiz/generate-date-question", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ allWorks: parsedWorks }),
            });

            if (response.ok) {
                const questionData = await response.json();
                setData(questionData);
            }
        } catch (error) {
            console.error("Failed to fetch question:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, [parsedWorks]);

    const handleOptionClick = (year: number) => {
        if (selectedOption !== null || !data) return;

        setSelectedOption(year);
        if (year === data.answer) {
            setScore(s => s + 50);
        }
    };

    return (
        <main className="min-h-screen p-8 max-w-2xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Exit</span>
                </Link>
                <div className="font-mono text-amber-600 font-bold">Score: {score}</div>
            </header>

            <div className="text-center mb-12">
                <div className="inline-block p-3 bg-stone-100 rounded-full mb-4 text-stone-600">
                    <Brain size={32} />
                </div>
                <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">
                    Date Master
                </h1>
                <p className="text-stone-600">
                    When was this work published?
                </p>
            </div>

            {parsedWorks.length === 0 ? (
                <div className="text-center p-8 bg-amber-50 rounded-xl text-amber-800">
                    Add works in the Editor to start the quiz!
                </div>
            ) : loading || !data ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
                </div>
            ) : (
                <div className="space-y-8">
                    <motion.div
                        key={data.question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center"
                    >
                        <h2 className="text-2xl font-bold font-serif text-stone-800 mb-2">
                            {data.question.title}
                        </h2>
                        <p className="text-lg text-stone-600 italic">
                            by {data.question.author}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                        {data.options.map((year, index) => {
                            let buttonStyle = "bg-white border-stone-200 hover:border-amber-400 text-stone-800";

                            if (selectedOption !== null) {
                                if (year === data.answer) {
                                    buttonStyle = "bg-green-100 border-green-500 text-green-800 font-bold";
                                } else if (year === selectedOption) {
                                    buttonStyle = "bg-red-100 border-red-500 text-red-800";
                                } else {
                                    buttonStyle = "bg-stone-50 border-stone-100 text-stone-400";
                                }
                            }

                            return (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleOptionClick(year)}
                                    disabled={selectedOption !== null}
                                    className={`p-6 rounded-xl border-2 text-xl font-mono transition-all ${buttonStyle}`}
                                >
                                    {year}
                                </motion.button>
                            );
                        })}
                    </div>

                    {selectedOption !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center mt-8"
                        >
                            <button
                                onClick={fetchQuestion}
                                className="flex items-center gap-2 bg-stone-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-stone-700 transition-colors"
                            >
                                <RefreshCw size={20} />
                                <span>Next Question</span>
                            </button>
                        </motion.div>
                    )}
                </div>
            )}
        </main>
    );
}
