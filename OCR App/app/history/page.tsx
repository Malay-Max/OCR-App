'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Document {
    id: number;
    originalName: string;
    title?: string | null;
    extractedText: string;
    createdAt: string;
}

function HistoryItem({ doc }: { doc: Document }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition-all hover:shadow-md cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{doc.title || doc.originalName}</h3>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(doc.createdAt).toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <article className="prose prose-xl prose-blue max-w-none dark:prose-invert text-gray-600 dark:text-gray-300">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code: ({ node, ...props }) => <span className="font-sans whitespace-pre-wrap" {...props} />,
                                    pre: ({ node, ...props }) => <pre className="not-prose font-sans whitespace-pre-wrap bg-transparent p-0" {...props} />
                                }}
                            >
                                {doc.extractedText}
                            </ReactMarkdown>
                        </article>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function HistoryPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/history')
            .then((res) => res.json())
            .then((data) => {
                setDocuments(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8 font-sans transition-colors">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">History</h1>
                </header>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading history...</div>
                    ) : documents.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">No documents processed yet.</div>
                    ) : (
                        <div className="space-y-4 p-4">
                            {documents.map((doc) => (
                                <HistoryItem key={doc.id} doc={doc} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
