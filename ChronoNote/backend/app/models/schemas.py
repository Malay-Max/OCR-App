"""
Pydantic models for data validation and serialization.
Defines the contract for AI-extracted historical works and internal storage.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID, uuid4


class AIExtractedWork(BaseModel):
    """
    The structure we expect from Gemini AI for each historical work/event.
    """
    title: str = Field(..., description="Cleaned title of work/event")
    author_or_source: Optional[str] = Field(
        None, 
        description="Author/creator if available"
    )
    year: int = Field(
        ..., 
        description="Integer year. Ignore items without specific years."
    )


class AIResponseEnvelope(BaseModel):
    """
    The wrapper for the AI response containing all extracted works.
    """
    works: List[AIExtractedWork]


class StoredWorkItem(AIExtractedWork):
    """
    Internal model stored in Redis. Extends AIExtractedWork with a unique ID.
    """
    id: UUID = Field(default_factory=uuid4)


class UploadResponse(BaseModel):
    """Response model for the upload endpoint."""
    success: bool
    message: str
    works_count: int
    session_id: str


class TimelineResponse(BaseModel):
    """Response model for the timeline endpoint."""
    works: List[StoredWorkItem]


class ChronoTestWork(BaseModel):
    """Work item for chronology test - without year field."""
    id: UUID
    title: str
    author_or_source: Optional[str]


class ChronoTestResponse(BaseModel):
    """Response model for chronology test."""
    works: List[ChronoTestWork]


class ChronoCheckRequest(BaseModel):
    """Request model for checking chronological order."""
    ordered_ids: List[UUID]


class ChronoCheckResponse(BaseModel):
    """Response model for chronology check."""
    success: bool
    correct: bool
    correct_order: List[UUID]
    message: str


class QuizQuestion(BaseModel):
    """Quiz question with work info and year options."""
    work_id: UUID
    title: str
    author_or_source: Optional[str]
    year_options: List[int]


class QuizAnswerRequest(BaseModel):
    """Request model for quiz answer submission."""
    work_id: UUID
    selected_year: int


class QuizAnswerResponse(BaseModel):
    """Response model for quiz answer validation."""
    correct: bool
    actual_year: int
    message: str
