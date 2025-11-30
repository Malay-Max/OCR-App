/**
 * Date Quiz Page Component
 * Quiz game to guess the correct year for historical works.
 */
import { useEffect, useState } from 'react';
import { TimeMachineConsole } from '../components/Layout/TimeMachineConsole';
import { ConsoleSidebar } from '../components/Layout/ConsoleSidebar';
import { getNextQuizQuestion, checkQuizAnswer } from '../services/api';
import { useTimelineStore } from '../store/timelineStore';
import type { QuizQuestion } from '../types';

export const DateQuiz: React.FC = () => {
    const { addQuizResult, quizScore } = useTimelineStore();
    const [question, setQuestion] = useState<QuizQuestion | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ correct: boolean; actualYear: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadNextQuestion = async () => {
        try {
            setIsLoading(true);
            setSelectedYear(null);
            setFeedback(null);
            const nextQuestion = await getNextQuizQuestion();
            setQuestion(nextQuestion);
        } catch (error: any) {
            if (error.response?.status === 404) {
                // No more data
                setQuestion(null);
            } else {
                console.error('Failed to load quiz question:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNextQuestion();
    }, []);

    const handleYearSelect = async (year: number) => {
        if (!question || selectedYear !== null) return;

        setSelectedYear(year);

        try {
            const response = await checkQuizAnswer({
                work_id: question.work_id,
                selected_year: year,
            });

            setFeedback({
                correct: response.correct,
                actualYear: response.actual_year,
            });

            // Add to results
            addQuizResult({
                work_id: question.work_id,
                title: question.title,
                selected_year: year,
                correct_year: response.actual_year,
                is_correct: response.correct,
            });

            // Auto-load next question after delay
            setTimeout(() => {
                loadNextQuestion();
            }, 2000);
        } catch (error) {
            console.error('Failed to check answer:', error);
        }
    };

    const handleSkip = () => {
        if (!question) return;

        addQuizResult({
            work_id: question.work_id,
            title: question.title,
            selected_year: null,
            correct_year: 0, // Will be unknown
            is_correct: null,
        });

        loadNextQuestion();
    };

    return (
        <TimeMachineConsole>
            <ConsoleSidebar />

            <div className="ml-48 pr-8">
                <h1 className="font-brass text-4xl text-brass-400 mb-4 text-center">
                    DATE QUIZ
                </h1>

                {/* Score Display */}
                <div className="flex justify-center gap-8 mb-8">
                    <div className="text-center">
                        <div className="text-3xl font-display text-green-400">{quizScore.correct}</div>
                        <div className="text-sm font-mono text-brass-400">Correct</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-display text-red-400">{quizScore.incorrect}</div>
                        <div className="text-sm font-mono text-brass-400">Incorrect</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-display text-yellow-400">{quizScore.skipped}</div>
                        <div className="text-sm font-mono text-brass-400">Skipped</div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto border-4 border-electric-500 border-t-transparent rounded-full animate-spin" />
                        <p className="font-mono text-brass-400 mt-4">Loading...</p>
                    </div>
                ) : question ? (
                    <div className="max-w-3xl mx-auto">
                        {/* Question */}
                        <div className="retro-screen p-8 mb-8">
                            <h3 className="font-brass text-2xl text-brass-300 mb-4 text-center">
                                {question.title}
                            </h3>
                            {question.author_or_source && (
                                <p className="font-mono text-electric-300 text-center mb-6">
                                    by {question.author_or_source}
                                </p>
                            )}
                            <p className="font-display text-lg text-brass-400 text-center">
                                What year was this published/created?
                            </p>
                        </div>

                        {/* Year Options */}
                        <div className="grid grid-cols-2 gap-6">
                            {question.year_options.map((year) => {
                                const isSelected = selectedYear === year;
                                const isCorrect = feedback && year === feedback.actualYear;
                                const isWrong = feedback && isSelected && !feedback.correct;

                                return (
                                    <button
                                        key={year}
                                        onClick={() => handleYearSelect(year)}
                                        disabled={selectedYear !== null}
                                        className={`
                      p-8 rounded-lg font-display text-3xl font-bold
                      transition-all duration-300 border-4
                      ${isCorrect
                                                ? 'bg-green-500 border-green-300 shadow-glow-electric scale-105'
                                                : isWrong
                                                    ? 'bg-red-500 border-red-300 opacity-50'
                                                    : 'bg-brass-700 border-brass-500 hover:bg-brass-600 hover:shadow-glow-brass hover:scale-105'
                                            }
                      ${selectedYear !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                                    >
                                        {year}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Skip Button */}
                        {!feedback && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={handleSkip}
                                    className="btn-brass opacity-50 hover:opacity-100"
                                >
                                    SKIP
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="font-mono text-brass-400 mb-8">No more questions available</p>
                        <button onClick={() => window.location.href = '/'} className="btn-brass">
                            RETURN TO UPLOAD
                        </button>
                    </div>
                )}
            </div>
        </TimeMachineConsole>
    );
};
