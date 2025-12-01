import { Link, useLocation } from 'react-router-dom';
import './SteampunkSidebar.css';

export const SteampunkSidebar = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="steampunk-sidebar">
            <div className="sidebar-panel">
                {/* Navigation Buttons */}
                <Link
                    to="/timeline"
                    className={`nav-button ${isActive('/timeline') ? 'active' : ''}`}
                >
                    <span className="button-label">TIMELINE</span>
                </Link>

                <Link
                    to="/chrono-test"
                    className={`nav-button ${isActive('/chrono-test') ? 'active' : ''}`}
                >
                    <span className="button-label">CHRONO-TEST</span>
                </Link>

                <Link
                    to="/date-quiz"
                    className={`nav-button ${isActive('/date-quiz') ? 'active' : ''}`}
                >
                    <span className="button-label">DATE QUIZ</span>
                </Link>

                {/* Decorative ventilation slots */}
                <div className="ventilation-slots">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="vent-slot"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};
