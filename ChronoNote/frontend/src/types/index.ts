/**
 * TypeScript type definitions for ChronoNote application.
 * Matches backend Pydantic models.
 */

export interface Work {
    id: string;
    title: string;
    author_or_source: string | null;
    year: number;
}

export interface ChronoTestWork {
    id: string;
    title: string;
    author_or_source: string | null;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    works_count: number;
    session_id: string;
}

export interface TimelineResponse {
    works: Work[];
}

export interface ChronoTestResponse {
    works: ChronoTestWork[];
}

export interface ChronoCheckRequest {
    ordered_ids: string[];
}

export interface ChronoCheckResponse {
    success: boolean;
    correct: boolean;
    correct_order: string[];
    message: string;
}

export interface QuizQuestion {
    work_id: string;
    title: string;
    author_or_source: string | null;
    year_options: number[];
}

export interface QuizAnswerRequest {
    work_id: string;
    selected_year: number;
}

export interface QuizAnswerResponse {
    correct: boolean;
    actual_year: number;
    message: string;
}

export interface QuizResult {
    work_id: string;
    title: string;
    selected_year: number | null;
    correct_year: number;
    is_correct: boolean | null; // null means skipped
}
