import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTimeline } from '../services/api';
import { SteampunkSidebar } from '../components/Layout/SteampunkSidebar';
import type { Work } from '../types';
import './NewTimeline.css';

export const NewTimeline = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [selectedWork, setSelectedWork] = useState<Work | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTimeline = async () => {
            try {
                const response = await getTimeline();
                setWorks(response.works);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    // No timeline data, redirect to landing
                    navigate('/');
                } else {
                    setError('Failed to load timeline data');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadTimeline();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="steampunk-timeline">
                <SteampunkSidebar />
                <div className="timeline-content">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading Temporal Data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="steampunk-timeline">
                <SteampunkSidebar />
                <div className="timeline-content">
                    <div className="error-state">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate positions for works around the timeline circle
    const getWorkPosition = (index: number, total: number) => {
        const angle = (index / total) * 360;
        const radius = 280; // Distance from center
        const radians = (angle - 90) * (Math.PI / 180);

        return {
            x: Math.cos(radians) * radius,
            y: Math.sin(radians) * radius,
            angle
        };
    };

    return (
        <div className="steampunk-timeline">
            {/* Vacuum Tubes - Left */}
            <div className="vacuum-tubes tubes-left">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={`left-${i}`} className="vacuum-tube">
                        <div className="tube-glow"></div>
                    </div>
                ))}
            </div>

            {/* Vacuum Tubes - Right */}
            <div className="vacuum-tubes tubes-right">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={`right-${i}`} className="vacuum-tube">
                        <div className="tube-glow"></div>
                    </div>
                ))}
            </div>

            <SteampunkSidebar />

            <div className="timeline-content">
                <h1 className="page-title">MASTER HISTORICAL TIMELINE</h1>

                <div className="timeline-visualization">
                    {/* Central Timeline Circle */}
                    <div className="timeline-circle">
                        {/* Glowing outer ring */}
                        <div className="timeline-ring ring-outer"></div>
                        <div className="timeline-ring ring-middle"></div>
                        <div className="timeline-ring ring-inner"></div>

                        {/* Energy center */}
                        <div className="timeline-center">
                            <div className="center-glow"></div>
                        </div>

                        {/* Work Items positioned around circle */}
                        {works.map((work, index) => {
                            const pos = getWorkPosition(index, works.length);
                            return (
                                <div
                                    key={work.id}
                                    className="timeline-work"
                                    style={{
                                        transform: `translate(${pos.x}px, ${pos.y}px)`
                                    }}
                                    onClick={() => setSelectedWork(work)}
                                >
                                    {/* Lightning bolt to center */}
                                    <svg className="lightning-bolt" viewBox="0 0 100 100">
                                        <path
                                            d={`M 50 50 L ${50 - pos.x / 6} ${50 - pos.y / 6}`}
                                            stroke="#00D4FF"
                                            strokeWidth="2"
                                            fill="none"
                                            className="lightning-path"
                                        />
                                    </svg>

                                    {/* Work marker */}
                                    <div className="work-marker">
                                        <div className="marker-glow"></div>
                                        <div className="work-year">{work.year}</div>
                                    </div>

                                    {/* Work label */}
                                    <div className="work-label">
                                        <div className="work-title-short">{work.title}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Selected Work Detail Card */}
                    {selectedWork && (
                        <div className="work-detail-card">
                            <button
                                className="close-button"
                                onClick={() => setSelectedWork(null)}
                            >
                                ×
                            </button>
                            <h3 className="work-title">{selectedWork.title}</h3>
                            {selectedWork.author_or_source && (
                                <p className="work-author">by {selectedWork.author_or_source}</p>
                            )}
                            <div className="work-year-large">{selectedWork.year}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
