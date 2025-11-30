/**
 * Timeline Page Component
 * Displays historical works in chronological order.
 */
import React, { useEffect } from 'react';
import { TimeMachineConsole } from '../components/Layout/TimeMachineConsole';
import { ConsoleSidebar } from '../components/Layout/ConsoleSidebar';
import { getTimeline } from '../services/api';
import { useTimelineStore } from '../store/timelineStore';

export const Timeline: React.FC = () => {
    const { works, setWorks, setLoading, setError } = useTimelineStore();

    useEffect(() => {
        const loadTimeline = async () => {
            try {
                setLoading(true);
                const response = await getTimeline();
                setWorks(response.works);
            } catch (error: any) {
                setError(error.response?.data?.detail || 'Failed to load timeline');
            } finally {
                setLoading(false);
            }
        };

        loadTimeline();
    }, [setWorks, setLoading, setError]);

    return (
        <TimeMachineConsole>
            <ConsoleSidebar />

            <div className="ml-48 pr-8">
                <h1 className="font-brass text-4xl text-brass-400 mb-8 text-center">
                    TEMPORAL TIMELINE
                </h1>

                {works.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="font-mono text-brass-400">No timeline data available</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {works.map((work, index) => (
                            <div
                                key={work.id}
                                className="holographic-card p-6 relative overflow-hidden group"
                            >
                                {/* Year badge */}
                                <div className="absolute top-4 right-4 px-4 py-2 bg-electric-500 rounded-lg font-display font-bold text-2xl shadow-glow-electric">
                                    {work.year}
                                </div>

                                {/* Content */}
                                <div className="pr-24">
                                    <h3 className="font-brass text-2xl text-brass-300 mb-2">
                                        {work.title}
                                    </h3>
                                    {work.author_or_source && (
                                        <p className="font-mono text-electric-300">
                                            by {work.author_or_source}
                                        </p>
                                    )}
                                </div>

                                {/* Connection line to next item */}
                                {index < works.length - 1 && (
                                    <div className="absolute left-1/2 -bottom-4 w-0.5 h-8 bg-electric-500/50" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </TimeMachineConsole>
    );
};
