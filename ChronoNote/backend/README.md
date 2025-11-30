# ChronoNote Backend

FastAPI backend for ChronoNote - a retro-futuristic time machine application that extracts historical references from markdown notes using AI.

## Features

- **AI-Powered Extraction**: Uses Gemini 2.0 Flash to extract historical works with titles, authors, and years
- **Session-Based Storage**: Temporary data storage in Redis with 2-hour TTL
- **Interactive Minigames**: API endpoints for chronology tests and date quizzes
- **RESTful API**: Clean, documented API endpoints with Pydantic validation

## Setup

### Prerequisites

- Python 3.10 or higher
- Redis server running (default: localhost:6379)
- Gemini API key

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Running the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python directly
python -m app.main
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## API Endpoints

### `POST /api/upload`
Upload markdown file and extract historical references

### `GET /api/timeline`
Get sorted timeline data

### `GET /api/chrono-test`
Get randomized works for chronology test

### `POST /api/chrono-check`
Validate chronological order

### `GET /api/date-quiz/next`
Get next quiz question

### `POST /api/date-quiz/check`
Check quiz answer

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Settings management
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   ├── services/
│   │   ├── ai_service.py    # Gemini AI integration
│   │   └── redis_service.py # Redis operations
│   ├── api/
│   │   └── routes.py        # API endpoints
│   └── middleware/
│       └── session.py       # Session management
├── requirements.txt
└── .env
```

## Environment Variables

See `.env.example` for all available configuration options.

## License

MIT
