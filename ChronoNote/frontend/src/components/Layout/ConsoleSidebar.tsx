/**
 * Console Sidebar Navigation Component
 * Mechanical button navigation for different views.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const ConsoleSidebar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/timeline', label: 'TIMELINE', icon: '⏱' },
        { path: '/chrono-test', label: 'CHRONO-TEST', icon: '🔄' },
        { path: '/date-quiz', label: 'DATE QUIZ', icon: '❓' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="fixed left-0 top-1/2 -translate-y-1/2 z-20 ml-4">
            <div className="leather-panel space-y-4">
                {/* Console Title */}
                <div className="text-center mb-6">
                    <h2 className="font-brass text-brass-400 text-xl tracking-wider">
                        CONTROLS
                    </h2>
                    <div className="w-full h-0.5 bg-brass-600 mt-2" />
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col gap-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                group relative px-4 py-3 rounded-md
                font-display text-sm font-semibold tracking-wide
                border-2 transition-all duration-200
                ${isActive(item.path)
                                    ? 'bg-electric-500 border-electric-300 text-white shadow-glow-electric'
                                    : 'bg-brass-700 border-brass-500 text-brass-200 hover:bg-brass-600 hover:border-brass-400'
                                }
              `}
                        >
                            {/* Icon */}
                            <div className="text-2xl mb-1 text-center">{item.icon}</div>

                            {/* Label */}
                            <div className="text-center text-xs">{item.label}</div>

                            {/* Glow effect on hover */}
                            {!isActive(item.path) && (
                                <div className="absolute inset-0 rounded-md bg-electric-500/0 group-hover:bg-electric-500/10 transition-all duration-200" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Decorative brass dial */}
                <div className="flex justify-center mt-6">
                    <div className="brass-dial !w-12 !h-12 flex items-center justify-center">
                        <div className="w-1 h-6 bg-machine-900 rounded-full" />
                    </div>
                </div>
            </div>
        </aside>
    );
};
