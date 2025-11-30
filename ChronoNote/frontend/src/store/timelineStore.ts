/**
 * Zustand store for managing application state.
 * Handles timeline data, loading states, and errors.
 */
import { create } from 'zustand';
import type { Work, ChronoTestWork, QuizQuestion, QuizResult } from '../types';

interface TimelineState {
    // Timeline data
    works: Work[];
    hasData: boolean;

    // Loading states
    isLoading: boolean;
    isUploading: boolean;

    // Error handling
    error: string | null;

    // Chronology test state
    chronoTestWorks: ChronoTestWork[];
    chronoTestResult: {
        correct: boolean;
        correctOrder: string[];
    } | null;

    // Quiz state
    currentQuizQuestion: QuizQuestion | null;
    quizResults: QuizResult[];
    quizScore: { correct: number; incorrect: number; skipped: number };

    // Actions
    setWorks: (works: Work[]) => void;
    setLoading: (loading: boolean) => void;
    setUploading: (uploading: boolean) => void;
    setError: (error: string | null) => void;
    setChronoTestWorks: (works: ChronoTestWork[]) => void;
    setChronoTestResult: (result: { correct: boolean; correctOrder: string[] }) => void;
    resetChronoTest: () => void;
    setCurrentQuizQuestion: (question: QuizQuestion | null) => void;
    addQuizResult: (result: QuizResult) => void;
    resetQuiz: () => void;
    clearData: () => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
    // Initial state
    works: [],
    hasData: false,
    isLoading: false,
    isUploading: false,
    error: null,
    chronoTestWorks: [],
    chronoTestResult: null,
    currentQuizQuestion: null,
    quizResults: [],
    quizScore: { correct: 0, incorrect: 0, skipped: 0 },

    // Actions
    setWorks: (works) => set({ works, hasData: works.length > 0, error: null }),

    setLoading: (loading) => set({ isLoading: loading }),

    setUploading: (uploading) => set({ isUploading: uploading }),

    setError: (error) => set({ error }),

    setChronoTestWorks: (works) => set({ chronoTestWorks: works }),

    setChronoTestResult: (result) => set({ chronoTestResult: result }),

    resetChronoTest: () => set({ chronoTestWorks: [], chronoTestResult: null }),

    setCurrentQuizQuestion: (question) => set({ currentQuizQuestion: question }),

    addQuizResult: (result) => set((state) => {
        const newResults = [...state.quizResults, result];

        // Calculate score
        const correct = newResults.filter(r => r.is_correct === true).length;
        const incorrect = newResults.filter(r => r.is_correct === false).length;
        const skipped = newResults.filter(r => r.is_correct === null).length;

        return {
            quizResults: newResults,
            quizScore: { correct, incorrect, skipped },
        };
    }),

    resetQuiz: () => set({
        currentQuizQuestion: null,
        quizResults: [],
        quizScore: { correct: 0, incorrect: 0, skipped: 0 },
    }),

    clearData: () => set({
        works: [],
        hasData: false,
        chronoTestWorks: [],
        chronoTestResult: null,
        currentQuizQuestion: null,
        quizResults: [],
        quizScore: { correct: 0, incorrect: 0, skipped: 0 },
        error: null,
    }),
}));
