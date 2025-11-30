/**
 * Main App Component
 * Sets up routing and global application structure.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Timeline } from './pages/Timeline';
import { ChronoTest } from './pages/ChronoTest';
import { DateQuiz } from './pages/DateQuiz';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/chrono-test" element={<ChronoTest />} />
        <Route path="/date-quiz" element={<DateQuiz />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
