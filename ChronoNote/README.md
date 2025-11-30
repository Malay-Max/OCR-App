# ChronoNote - Retro-Futuristic Time Machine Application

A web application that uses AI to extract historical references from markdown notes and presents them in an interactive, retro-futuristic "Time Machine" interface with educational minigames.

![ChronoNote Banner](https://placeholder-for-screenshot.png)

## 🎨 Features

- **AI-Powered Historical Extraction**: Uses Google's Gemini 2.0 Flash to intelligently extract titles, authors, and years from unstructured markdown text
- **Retro-Futuristic UI**: Steampunk-inspired interface with brass bezels, glowing vacuum tubes, mechanical gears, and plasma effects
- **Interactive Timeline**: Visualize historical works chronologically with holographic cards and energy effects
- **Chronology Test**: Drag-and-drop minigame to test your ability to order historical events
- **Date Quiz**: Multiple-choice quiz game to guess publication/creation years
- **Session-Based Storage**: Temporary data storage in Redis with 2-hour TTL - no permanent database required
- **Fully Responsive**: Works on desktop and mobile devices

## 🛠️ Technology Stack

### Backend
- **Python 3.10+** with FastAPI framework
- **Gemini 2.0 Flash** for AI extraction
- **Redis** for session-based data storage
- **Pydantic** for data validation

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **@dnd-kit** for drag-and-drop functionality
- **Axios** for API calls

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js 18+ and npm
- Redis server running locally or remotely
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ChronoNote
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env

# Edit .env and add your GEMINI_API_KEY
# GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Redis Setup

**Option A: Local Redis (Windows)**
```bash
# Download Redis for Windows from: https://github.com/microsoftarchive/redis/releases
# Or use Windows Subsystem for Linux (WSL) and install Redis there
```

**Option B: Docker**
```bash
docker run -d -p 6379:6379 redis:latest
```

**Option C: Cloud Redis**
- Use a cloud provider like Redis Labs, AWS ElastiCache, etc.
- Update `REDIS_HOST` and `REDIS_PORT` in `.env`

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🎮 Running the Application

### Start Backend Server

```bash
cd backend
# Make sure virtual environment is activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The app will be available at: `http://localhost:5173`

## 📖 Usage

1. **Upload**: Drop a markdown file (.md, .txt) containing historical references on the landing page
2. **Timeline**: View extracted works displayed chronologically with years
3. **Chrono Test**: Test your knowledge by drag-and-dropping items into chronological order
4. **Date Quiz**: Guess the correct year from multiple choice options

### Sample Markdown File

Create a file called `sample_history.md`:

```markdown
# My Historical Notes

I recently read "1984" by George Orwell, published in 1949.

The Declaration of Independence was signed in 1776.

Leonardo da Vinci painted the Mona Lisa around 1503.

The first iPhone was released by Apple in 2007.

World War II ended in 1945.
```

## 🎨 UI Customization

The retro-futuristic theme can be customized in:
- `frontend/tailwind.config.js` - Colors, fonts, animations
- `frontend/src/index.css` - Custom animations and components

### Theme Colors
- **Brass**: Mechanical elements, frames, buttons
- **Electric Blue**: Energy effects, active states
- **Plasma Purple**: Glowing effects, highlights
- **Leather Brown**: Panel backgrounds
- **Machine Dark**: Background colors

## 🏗️ Project Structure

```
ChronoNote/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── models/       # Pydantic schemas
│   │   ├── services/     # AI and Redis services
│   │   ├── middleware/   # Session management
│   │   ├── config.py     # Configuration
│   │   └── main.py       # FastAPI app
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── services/     # API client
    │   ├── store/        # Zustand store
    │   ├── types/        # TypeScript types
    │   └── index.css     # Global styles
    ├── tailwind.config.js
    └── package.json
```

## 🔧 Configuration

### Backend (.env)

```env
GEMINI_API_KEY=your_api_key_here
REDIS_HOST=localhost
REDIS_PORT=6379
SESSION_TTL_SECONDS=7200  # 2 hours
UPLOAD_MAX_SIZE_KB=50
```

### Frontend

Edit `src/services/api.ts` if backend URL changes:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  // ...
});
```

## 🐛 Troubleshooting

### Backend Issues

**ImportError / Module not found**
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

**Redis Connection Error**
- Verify Redis is running: `redis-cli ping` (should return "PONG")
- Check `REDIS_HOST` and `REDIS_PORT` in `.env`

**Gemini API Error**
- Verify API key is correct in `.env`
- Check API quota at Google AI Studio

### Frontend Issues

**Module not found**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Connection Error**
- Ensure backend is running on port 8000
- Check CORS settings in `backend/app/main.py`

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- FastAPI for the excellent Python web framework
- React and the amazing ecosystem of tools

## 👤 Author

Built with ❤️ as a demonstration of AI-powered applications

---

**Ready to time travel? Start uploading your historical notes!** ⏱️✨
