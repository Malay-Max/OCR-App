export interface Author {
    id: string;
    name: string;
    noteId: string;
    works?: Work[];
}

export interface Work {
    id: string;
    title: string;
    publicationDate: string;
    year: number;
    authorId: string;
    noteId: string;
    imageUrl?: string;
    author?: Author;
}

export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authors?: Author[];
    works?: Work[];
}

export interface TimelineEvent {
    id: string;
    title: string;
    author: string;
    date: string;
    year: number;
    imageUrl?: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
}

export interface QuizSession {
    id: string;
    noteId: string;
    score: number;
    totalQuestions: number;
    completedAt: Date;
    questions: QuizQuestion[];
}

export interface ExtractionResult {
    title: string;
    authors: Array<{
        name: string;
        works: Array<{
            title: string;
            publicationDate: string;
            year: number;
        }>;
    }>;
}
