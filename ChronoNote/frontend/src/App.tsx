/**
 * Main App Component
 * Sets up routing and global application structure.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NewLanding } from './pages/NewLanding';
import { NewTimeline } from './pages/NewTimeline';
import { ChronoTest } from './pages/ChronoTest';
import { DateQuiz } from './pages/DateQuiz';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewLanding />} />
        <Route path="/timeline" element={<NewTimeline />} />
        <Route path="/chrono-test" element={<ChronoTest />} />
        <Route path="/date-quiz" element={<DateQuiz />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
