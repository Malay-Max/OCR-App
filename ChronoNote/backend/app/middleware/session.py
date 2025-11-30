"""
Session middleware for managing browser session cookies.
Creates and validates session UUIDs for temporary data storage.
"""
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import settings


class SessionMiddleware(BaseHTTPMiddleware):
    """
    Middleware to manage session cookies.
    Creates a new session UUID if one doesn't exist.
    """
    
    async def dispatch(self, request: Request, call_next):
        """Process request and inject session ID."""
        
        # Check if session cookie exists
        session_id = request.cookies.get(settings.session_cookie_name)
        
        # If no session exists, create a new one
        if not session_id:
            session_id = str(uuid.uuid4())
            request.state.session_id = session_id
            request.state.new_session = True
        else:
            request.state.session_id = session_id
            request.state.new_session = False
        
        # Process the request
        response: Response = await call_next(request)
        
        # Set cookie if it's a new session
        if request.state.new_session:
            response.set_cookie(
                key=settings.session_cookie_name,
                value=session_id,
                httponly=settings.session_cookie_httponly,
                secure=settings.session_cookie_secure,
                samesite=settings.session_cookie_samesite,
                max_age=settings.session_ttl_seconds
            )
        
        return response


def get_session_id(request: Request) -> str:
    """
    Dependency to get the session ID from the request state.
    
    Args:
        request: FastAPI request object
        
    Returns:
        Session ID string
    """
    return request.state.session_id
