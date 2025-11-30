'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Button from '../ui/button';
import Card from '../ui/card';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

interface QuizInterfaceProps {
    questions: QuizQuestion[];
    sessionId: string;
    onComplete: (score: number, total: number) => void;
}

export default function QuizInterface({ questions, sessionId, onComplete }: QuizInterfaceProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleSelectAnswer = (answer: string) => {
        if (showFeedback) return; // Prevent changing answer after seeing feedback

        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion.id]: answer,
        });

        setShowFeedback(true);

        // Auto-advance after showing feedback
        setTimeout(() => {
            if (!isLastQuestion) {
                setCurrentIndex(currentIndex + 1);
                setShowFeedback(false);
            }
        }, 1500);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const answers = questions.map((q) => ({
                questionId: q.id,
                userAnswer: selectedAnswers[q.id] || '',
            }));

            const response = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, answers }),
            });

            const result = await response.json();

            if (result.percentage >= 70) {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.5 },
                });
            }

            onComplete(result.score, result.totalQuestions);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            setIsSubmitting(false);
        }
    };

    const selectedAnswer = selectedAnswers[currentQuestion?.id];
    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

    return (
        <Card className="max-w-3xl mx-auto">
            <div className="space-y-6">
                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Question {currentIndex + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Question */}
                        <div>
                            <h3 className="text-xl font-serif font-bold text-foreground mb-6">
                                {currentQuestion.question}
                            </h3>

                            {/* Options */}
                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => {
                                    const isSelected = selectedAnswer === option;
                                    const showAsCorrect = showFeedback && option === currentQuestion.correctAnswer;
                                    const showAsWrong = showFeedback && isSelected && !isCorrect;

                                    return (
                                        <motion.button
                                            key={index}
                                            onClick={() => handleSelectAnswer(option)}
                                            disabled={showFeedback}
                                            whileHover={!showFeedback ? { scale: 1.02 } : undefined}
                                            whileTap={!showFeedback ? { scale: 0.98 } : undefined}
                                            className={`
                        w-full p-4 rounded-lg text-left transition-all duration-300
                        ${!showFeedback && !isSelected ? 'glass glass-hover' : ''}
                        ${!showFeedback && isSelected ? 'bg-primary/20 border-2 border-primary' : ''}
                        ${showAsCorrect ? 'bg-green-500/20 border-2 border-green-500' : ''}
                        ${showAsWrong ? 'bg-red-500/20 border-2 border-red-500' : ''}
                        disabled:cursor-not-allowed
                      `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${!showFeedback && isSelected ? 'border-primary bg-primary' : 'border-white/30'}
                          ${showAsCorrect ? 'border-green-500 bg-green-500' : ''}
                          ${showAsWrong ? 'border-red-500 bg-red-500' : ''}
                        `}>
                                                    {(showAsCorrect || (isSelected && !showFeedback)) && (
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                    {showAsWrong && (
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-foreground">{option}</span>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-3 justify-end">
                            {isLastQuestion && selectedAnswer && (
                                <Button
                                    onClick={handleSubmit}
                                    loading={isSubmitting}
                                    size="lg"
                                >
                                    Submit Quiz
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Card>
    );
}
