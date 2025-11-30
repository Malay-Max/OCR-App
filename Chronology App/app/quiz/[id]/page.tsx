'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QuizInterface from '@/components/quiz/quiz-interface';
import Loading from '@/components/ui/loading';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
    const [quizData, setQuizData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<any>(null);
    const [noteId, setNoteId] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        params.then((resolvedParams) => {
            setNoteId(resolvedParams.id);
            setLoading(false);
        });
    }, [params]);

    const generateQuiz = async () => {
        setGenerating(true);
        setError('');

        try {
            const response = await fetch('/api/quiz/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteId, count: 5 }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to generate quiz');
            }

            const data = await response.json();
            setQuizData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleQuizComplete = (score: number, total: number) => {
        setResult({ score, total, percentage: Math.round((score / total) * 100) });
    };

    if (loading) return <Loading fullPage />;

    if (result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-12 px-4 flex items-center justify-center">
                <Card className="max-w-lg">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="text-6xl">
                            {result.percentage >= 80 ? '🏆' : result.percentage >= 60 ? '⭐' : '📚'}
                        </div>
                        <h2 className="text-3xl font-bold text-gradient">Quiz Complete!</h2>
                        <div className="space-y-2">
                            <p className="text-5xl font-bold text-foreground">{result.percentage}%</p>
                            <p className="text-muted-foreground">
                                {result.score} out of {result.total} correct
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <Button onClick={generateQuiz} size="lg">
                                Try Again
                            </Button>
                            <Link href={`/timeline/${noteId}`}>
                                <Button variant="outline" size="lg">
                                    Back to Timeline
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </Card>
            </div>
        );
    }

    if (!quizData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-12 px-4 flex items-center justify-center">
                <Card className="max-w-lg">
                    <div className="text-center space-y-6">
                        <div className="text-6xl">📊</div>
                        <h2 className="text-3xl font-bold text-gradient">Ready for a Quiz?</h2>
                        <p className="text-muted-foreground">
                            Test your knowledge with AI-generated questions about the chronology of works in your timeline.
                        </p>
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                                {error}
                            </div>
                        )}
                        <div className="flex gap-3 justify-center flex-wrap">
                            <Button onClick={generateQuiz} loading={generating} size="lg">
                                {generating ? 'Generating Questions...' : 'Start Quiz'}
                            </Button>
                            <Link href={`/timeline/${noteId}`}>
                                <Button variant="outline" size="lg">
                                    Back to Timeline
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-12 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif font-bold text-gradient mb-4">
                        Chronology Quiz
                    </h1>
                </div>

                <QuizInterface
                    questions={quizData.questions}
                    sessionId={quizData.sessionId}
                    onComplete={handleQuizComplete}
                />
            </div>
        </div>
    );
}
