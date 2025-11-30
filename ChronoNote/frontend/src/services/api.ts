/**
 * API client for ChronoNote backend.
 * Handles all HTTP requests with automatic cookie handling.
 */
import axios from 'axios';
import type {
    UploadResponse,
    TimelineResponse,
    ChronoTestResponse,
    ChronoCheckRequest,
    ChronoCheckResponse,
    QuizQuestion,
    QuizAnswerRequest,
    QuizAnswerResponse,
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,  // Important: Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Upload markdown file and extract historical references.
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

/**
 * Get timeline data sorted by year.
 */
export const getTimeline = async (): Promise<TimelineResponse> => {
    const response = await api.get<TimelineResponse>('/timeline');
    return response.data;
};

/**
 * Get chronology test data.
 */
export const getChronoTest = async (): Promise<ChronoTestResponse> => {
    const response = await api.get<ChronoTestResponse>('/chrono-test');
    return response.data;
};

/**
 * Check chronological order.
 */
export const checkChronology = async (
    request: ChronoCheckRequest
): Promise<ChronoCheckResponse> => {
    const response = await api.post<ChronoCheckResponse>('/chrono-check', request);
    return response.data;
};

/**
 * Get next quiz question.
 */
export const getNextQuizQuestion = async (): Promise<QuizQuestion> => {
    const response = await api.get<QuizQuestion>('/date-quiz/next');
    return response.data;
};

/**
 * Check quiz answer.
 */
export const checkQuizAnswer = async (
    request: QuizAnswerRequest
): Promise<QuizAnswerResponse> => {
    const response = await api.post<QuizAnswerResponse>('/date-quiz/check', request);
    return response.data;
};

export default api;
