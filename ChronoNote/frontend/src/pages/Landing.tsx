/**
 * Landing Page Component
 * Upload portal with energy vortex and file dropzone.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TimeMachineConsole } from '../components/Layout/TimeMachineConsole';
import { EnergyVortex } from '../components/Upload/EnergyVortex';
import { FileDropzone } from '../components/Upload/FileDropzone';
import { uploadFile } from '../services/api';
import { useTimelineStore } from '../store/timelineStore';

export const Landing: React.FC = () => {
    const navigate = useNavigate();
    const { setUploading, setError } = useTimelineStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = async (file: File) => {
        try {
            setIsProcessing(true);
            setUploading(true);
            setError(null);

            // Upload file and extract historical references
            const response = await uploadFile(file);

            if (response.success) {
                // Wait a moment for dramatic effect
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Navigate to timeline
                navigate('/timeline');
            } else {
                setError('Upload failed. Please try again.');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            setError(error.response?.data?.detail || 'An error occurred during upload.');
        } finally {
            setIsProcessing(false);
            setUploading(false);
        }
    };

    return (
        <TimeMachineConsole>
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                {/* Title */}
                <h1 className="font-brass text-6xl text-brass-400 text-center mb-4 tracking-wider">
                    CHRONONOTE
                </h1>
                <div className="w-64 h-1 bg-brass-gradient mb-8" />

                <p className="font-display text-electric-300 text-xl text-center mb-12 max-w-2xl">
                    A TEMPORAL ANALYSIS ENGINE
                </p>

                {/* Energy Vortex */}
                {!isProcessing ? (
                    <EnergyVortex />
                ) : (
                    /* Processing Animation */
                    <div className="relative w-64 h-64 mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-32 h-32 mx-auto mb-4 border-8 border-electric-500 border-t-transparent rounded-full animate-spin" />
                                <p className="font-display text-electric-400 text-lg animate-pulse-glow">
                                    TEMPORAL PROCESSING...
                                </p>
                                <p className="font-mono text-brass-400 text-sm mt-2">
                                    Charging Flux Capacitors
                                </p>
                            </div>
                        </div>

                        {/* Sparking energy effects */}
                        <div className="absolute inset-0 animate-plasma-pulse">
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-1 bg-plasma-400 rounded-full shadow-glow-plasma"
                                    style={{
                                        top: '50%',
                                        left: '50%',
                                        transform: `rotate(${i * 30}deg) translateY(-100px)`,
                                        animation: `pulse-glow 1s ease-in-out infinite ${i * 0.1}s`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* File Dropzone */}
                {!isProcessing && (
                    <FileDropzone onFileSelect={handleFileSelect} isUploading={isProcessing} />
                )}

                {/* Instructions */}
                <div className="mt-12 max-w-2xl text-center">
                    <div className="leather-panel">
                        <h3 className="font-brass text-brass-300 text-lg mb-3">MISSION PARAMETERS</h3>
                        <ul className="font-mono text-brass-400 text-sm space-y-2 text-left">
                            <li>• Upload markdown notes containing historical references</li>
                            <li>• AI will extract titles, authors, and years</li>
                            <li>• Navigate the timeline and test your chronological knowledge</li>
                            <li>• Data persists for 2 hours in temporal storage</li>
                        </ul>
                    </div>
                </div>
            </div>
        </TimeMachineConsole>
    );
};
