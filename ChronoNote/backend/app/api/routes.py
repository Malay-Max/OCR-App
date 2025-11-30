"""
API routes for ChronoNote application.
Handles file upload, timeline data, chronology test, and date quiz.
"""
import random
import traceback
from typing import List
from uuid import UUID
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
from app.models.schemas import (
    UploadResponse, TimelineResponse, ChronoTestResponse, ChronoTestWork,
    ChronoCheckRequest, ChronoCheckResponse, QuizQuestion,
    QuizAnswerRequest, QuizAnswerResponse, StoredWorkItem
)
from app.services.ai_service import ai_service
from app.services.redis_service import redis_service
from app.middleware.session import get_session_id
from app.config import settings


router = APIRouter(prefix="/api", tags=["api"])


@router.post("/upload", response_model=UploadResponse)
async def upload_markdown(
    file: UploadFile = File(...),
    request: Request = None
):
    """
    Upload a markdown file and extract historical references using AI.
    
    - Accepts .md or .txt files (max 50KB)
    - Extracts historical works using Gemini AI
    - Stores data in Redis with session cookie
    - Returns count of extracted items
    """
    try:
        session_id = request.state.session_id
        print(f"[UPLOAD] Session ID: {session_id}")
        
        # Validate file type
        if not file.filename.endswith(('.md', '.txt', '.markdown')):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only .md, .txt, or .markdown files are accepted."
            )
        
        # Read file content
        try:
            content = await file.read()
            
            # Check file size
            file_size_kb = len(content) / 1024
            print(f"[UPLOAD] File size: {file_size_kb:.2f} KB")
            
            if file_size_kb > settings.upload_max_size_kb:
                raise HTTPException(
                    status_code=400,
                    detail=f"File too large. Maximum size is {settings.upload_max_size_kb}KB."
                )
            
            # Decode content
            markdown_text = content.decode('utf-8')
            print(f"[UPLOAD] File decoded successfully, length: {len(markdown_text)} chars")
            
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=400,
                detail="Invalid file encoding. File must be UTF-8 encoded."
            )
        except Exception as e:
            print(f"[UPLOAD ERROR] File reading error: {str(e)}")
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"Error reading file: {str(e)}"
            )
        
        # Extract historical works using AI
        try:
            print("[UPLOAD] Starting AI extraction...")
            extracted_works = await ai_service.extract_historical_works(markdown_text)
            print(f"[UPLOAD] AI extraction complete: {len(extracted_works)} works found")
        except Exception as e:
            print(f"[UPLOAD ERROR] AI extraction failed: {str(e)}")
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"AI extraction failed: {str(e)}"
            )
        
        # Convert to StoredWorkItem (adds UUIDs)
        try:
            print("[UPLOAD] Converting to StoredWorkItem...")
            stored_works = [StoredWorkItem(**work.model_dump()) for work in extracted_works]
            print(f"[UPLOAD] Conversion complete: {len(stored_works)} items")
        except Exception as e:
            print(f"[UPLOAD ERROR] Conversion failed: {str(e)}")
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"Failed to convert data: {str(e)}"
            )
        
        # Save to Redis
        try:
            print(f"[UPLOAD] Saving to Redis (session: {session_id})...")
            redis_service.save_session_data(session_id, stored_works)
            print("[UPLOAD] Redis save complete")
        except Exception as e:
            print(f"[UPLOAD ERROR] Redis save failed: {str(e)}")
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"Failed to save data: {str(e)}"
            )
        
        print(f"[UPLOAD] Success! Returning response")
        return UploadResponse(
            success=True,
            message=f"Successfully extracted {len(stored_works)} historical references.",
            works_count=len(stored_works),
            session_id=session_id
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[UPLOAD ERROR] Unexpected error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )


@router.get("/timeline", response_model=TimelineResponse)
async def get_timeline(session_id: str = Depends(get_session_id)):
    """
    Retrieve timeline data sorted by year (ascending).
    
    - Requires valid session cookie
    - Returns all works sorted chronologically
    """
    # Retrieve data from Redis
    works = redis_service.get_session_data(session_id)
    
    if works is None:
        raise HTTPException(
            status_code=404,
            detail="No timeline data found. Please upload a file first."
        )
    
    # Sort by year ascending
    works_sorted = sorted(works, key=lambda w: w.year)
    
    # Refresh session TTL
    redis_service.refresh_session_ttl(session_id)
    
    return TimelineResponse(works=works_sorted)


@router.get("/chrono-test", response_model=ChronoTestResponse)
async def get_chrono_test(session_id: str = Depends(get_session_id)):
    """
    Generate chronology test data.
    
    - Selects 5-7 random items from timeline
    - Removes year field from response
    - Shuffles order randomly
    """
    # Retrieve data from Redis
    works = redis_service.get_session_data(session_id)
    
    if works is None:
        raise HTTPException(
            status_code=404,
            detail="No timeline data found. Please upload a file first."
        )
    
    # Select random subset (5-7 items, or all if less than 5)
    num_items = min(len(works), random.randint(5, 7))
    selected_works = random.sample(works, num_items)
    
    # Convert to ChronoTestWork (removes year field)
    test_works = [
        ChronoTestWork(
            id=work.id,
            title=work.title,
            author_or_source=work.author_or_source
        )
        for work in selected_works
    ]
    
    # Shuffle randomly
    random.shuffle(test_works)
    
    # Refresh session TTL
    redis_service.refresh_session_ttl(session_id)
    
    return ChronoTestResponse(works=test_works)


@router.post("/chrono-check", response_model=ChronoCheckResponse)
async def check_chronology(
    request: ChronoCheckRequest,
    session_id: str = Depends(get_session_id)
):
    """
    Validate user's proposed chronological order.
    
    - Accepts list of work IDs in user's proposed order
    - Checks if years are in non-decreasing order
    - Returns correct order
    """
    # Retrieve data from Redis
    works = redis_service.get_session_data(session_id)
    
    if works is None:
        raise HTTPException(
            status_code=404,
            detail="No timeline data found. Please upload a file first."
        )
    
    # Create lookup map
    works_map = {work.id: work for work in works}
    
    # Validate all IDs exist
    for work_id in request.ordered_ids:
        if work_id not in works_map:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid work ID: {work_id}"
            )
    
    # Get the works in user's proposed order
    user_works = [works_map[work_id] for work_id in request.ordered_ids]
    
    # Check if years are in non-decreasing order
    is_correct = all(
        user_works[i].year <= user_works[i + 1].year
        for i in range(len(user_works) - 1)
    )
    
    # Get correct order
    correct_works = sorted(user_works, key=lambda w: w.year)
    correct_order = [work.id for work in correct_works]
    
    # Refresh session TTL
    redis_service.refresh_session_ttl(session_id)
    
    return ChronoCheckResponse(
        success=True,
        correct=is_correct,
        correct_order=correct_order,
        message="Correct order!" if is_correct else "Incorrect order. Try again!"
    )


@router.get("/date-quiz/next", response_model=QuizQuestion)
async def get_next_quiz_question(session_id: str = Depends(get_session_id)):
    """
    Generate next quiz question.
    
    - Picks 1 random work as target
    - Generates 3 plausible decoy years
    - Returns target work (without year shown) and 4 shuffled year options
    """
    # Retrieve data from Redis
    works = redis_service.get_session_data(session_id)
    
    if works is None:
        raise HTTPException(
            status_code=404,
            detail="No timeline data found. Please upload a file first."
        )
    
    # Pick random target work
    target_work = random.choice(works)
    
    # Generate 3 decoy years
    decoys = set()
    while len(decoys) < 3:
        # Generate decoy within +/- 5 to 20 years
        offset = random.randint(5, 20) * random.choice([-1, 1])
        decoy_year = target_work.year + offset
        
        # Ensure decoy is reasonable (not negative, not in far future)
        if 1 <= decoy_year <= 2100 and decoy_year != target_work.year:
            decoys.add(decoy_year)
    
    # Combine correct year with decoys and shuffle
    year_options = [target_work.year] + list(decoys)
    random.shuffle(year_options)
    
    # Refresh session TTL
    redis_service.refresh_session_ttl(session_id)
    
    return QuizQuestion(
        work_id=target_work.id,
        title=target_work.title,
        author_or_source=target_work.author_or_source,
        year_options=year_options
    )


@router.post("/date-quiz/check", response_model=QuizAnswerResponse)
async def check_quiz_answer(
    request: QuizAnswerRequest,
    session_id: str = Depends(get_session_id)
):
    """
    Validate quiz answer.
    
    - Checks if selected year matches the work's actual year
    - Returns correct/incorrect status and actual year
    """
    # Retrieve data from Redis
    works = redis_service.get_session_data(session_id)
    
    if works is None:
        raise HTTPException(
            status_code=404,
            detail="No timeline data found. Please upload a file first."
        )
    
    # Find the target work
    target_work = next((w for w in works if w.id == request.work_id), None)
    
    if target_work is None:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid work ID: {request.work_id}"
        )
    
    # Check if answer is correct
    is_correct = request.selected_year == target_work.year
    
    # Refresh session TTL
    redis_service.refresh_session_ttl(session_id)
    
    return QuizAnswerResponse(
        correct=is_correct,
        actual_year=target_work.year,
        message="Correct!" if is_correct else f"Incorrect. The correct year is {target_work.year}."
    )
