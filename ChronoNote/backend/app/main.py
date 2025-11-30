"""
ChronoNote - Retro-Futuristic Time Machine Application
Main FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.middleware.session import SessionMiddleware
from app.api.routes import router
from app.services.redis_service import redis_service


# Create FastAPI application
app = FastAPI(
    title="ChronoNote API",
    description="AI-powered historical timeline extraction and interactive learning",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add session middleware
app.add_middleware(SessionMiddleware)

# Include API router
app.include_router(router)


@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {
        "message": "ChronoNote API is running",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    Verifies API and Redis connectivity.
    """
    redis_status = "connected" if redis_service.ping() else "disconnected"
    
    return {
        "status": "healthy",
        "redis": redis_status
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
