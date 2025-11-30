/**
 * Energy Vortex Component
 * Animated swirling portal effect for the landing page.
 */
import React from 'react';

export const EnergyVortex: React.FC = () => {
    return (
        <div className="relative w-64 h-64 mx-auto">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-electric-500 opacity-30 animate-spin-slow" />

            {/* Middle rotating ring */}
            <div className="absolute inset-4 rounded-full border-4 border-plasma-500 opacity-50 animate-spin-medium"
                style={{ animationDirection: 'reverse' }} />

            {/* Inner glow */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-electric-400 to-plasma-600 opacity-60 animate-plasma-pulse" />

            {/* Center core */}
            <div className="absolute inset-16 rounded-full bg-white opacity-90 shadow-glow-plasma animate-pulse-glow" />

            {/* Energy particles */}
            <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-electric-300 rounded-full shadow-glow-electric"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${i * 45}deg) translateY(-80px)`,
                            animation: `pulse-glow 2s ease-in-out infinite ${i * 0.25}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
