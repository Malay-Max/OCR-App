/**
 * Time Machine Console Layout Component
 * The main wrapper that establishes the retro-futuristic aesthetic.
 */
import React, { type ReactNode } from 'react';

interface TimeMachineConsoleProps {
    children: ReactNode;
}

export const TimeMachineConsole: React.FC<TimeMachineConsoleProps> = ({ children }) => {
    return (
        <div className="console-container">
            {/* Background Gears (decorative) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 border-4 border-brass-500 rounded-full gear" />
                <div className="absolute top-40 right-20 w-24 h-24 border-4 border-brass-500 rounded-full gear"
                    style={{ animationDirection: 'reverse' }} />
                <div className="absolute bottom-20 left-1/4 w-40 h-40 border-4 border-brass-500 rounded-full gear" />
                <div className="absolute bottom-40 right-1/3 w-28 h-28 border-4 border-brass-500 rounded-full gear"
                    style={{ animationDirection: 'reverse' }} />
            </div>

            {/* Vacuum Tubes (decorative) - Top corners */}
            <div className="absolute top-8 left-8 flex gap-3">
                <div className="vacuum-tube" />
                <div className="vacuum-tube" style={{ animationDelay: '0.3s' }} />
                <div className="vacuum-tube" style={{ animationDelay: '0.6s' }} />
            </div>
            <div className="absolute top-8 right-8 flex gap-3">
                <div className="vacuum-tube" style={{ animationDelay: '0.2s' }} />
                <div className="vacuum-tube" style={{ animationDelay: '0.5s' }} />
                <div className="vacuum-tube" style={{ animationDelay: '0.8s' }} />
            </div>

            {/* Main Content Area - Brass Bezel Frame */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
                <div className="brass-bezel w-full max-w-7xl">
                    {/* Inner Screen */}
                    <div className="retro-screen p-6 min-h-[80vh]">
                        {children}
                    </div>
                </div>
            </div>

            {/* Mechanical Rivets - Decorative corners */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="rivet" />
                <div className="rivet" />
                <div className="rivet" />
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <div className="rivet" />
                <div className="rivet" />
                <div className="rivet" />
            </div>
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                <div className="rivet" />
                <div className="rivet" />
                <div className="rivet" />
            </div>
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <div className="rivet" />
                <div className="rivet" />
                <div className="rivet" />
            </div>
        </div>
    );
};
