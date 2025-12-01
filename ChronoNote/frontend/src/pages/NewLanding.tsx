import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../services/api';
import './NewLanding.css';

export const NewLanding = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const navigate = useNavigate();

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            await handleUpload(file);
        }
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            await handleUpload(file);
        }
    };

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        setUploadStatus(null);

        try {
            const response = await uploadFile(file);
            setUploadStatus({
                type: 'success',
                message: `Temporal data synchronized! ${response.works_count} historical references extracted.`
            });

            // Navigate to timeline after successful upload
            setTimeout(() => {
                navigate('/timeline');
            }, 1500);
        } catch (error: any) {
            setUploadStatus({
                type: 'error',
                message: error.response?.data?.detail || 'Temporal upload failed. Please try again.'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('file-input')?.click();
    };

    return (
        <div className="steampunk-landing">
            {/* Animated Gears Background */}
            <div className="gears-background">
                <div className="gear gear-1"></div>
                <div className="gear gear-2"></div>
                <div className="gear gear-3"></div>
                <div className="gear gear-4"></div>
            </div>

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

            {/* Main Content */}
            <div className="landing-content">
                {/* Title */}
                <h1 className="chrononote-title">CHRONONOTE</h1>

                {/* Energy Vortex */}
                <div
                    className={`energy-vortex ${isDragging ? 'vortex-active' : ''}`}
                    onDragOver={handleDrag}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDrop={handleDrop}
                >
                    {/* Vortex Rings */}
                    <div className="vortex-ring ring-1"></div>
                    <div className="vortex-ring ring-2"></div>
                    <div className="vortex-ring ring-3"></div>
                    <div className="vortex-ring ring-4"></div>

                    {/* Center Content */}
                    <div className="vortex-center">
                        {!isUploading && !uploadStatus && (
                            <>
                                <p className="vortex-title">INITIALIZE TEMPORAL</p>
                                <p className="vortex-title">DATA UPLOAD</p>
                                <p className="vortex-subtitle">(Drag & Drop .md file)</p>
                            </>
                        )}

                        {isUploading && (
                            <div className="uploading-indicator">
                                <div className="spinner"></div>
                                <p>Processing Temporal Data...</p>
                            </div>
                        )}

                        {uploadStatus && (
                            <div className={`upload-status ${uploadStatus.type}`}>
                                <p>{uploadStatus.message}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Manual Override Button */}
                <div className="manual-override">
                    <button
                        className="override-button"
                        onClick={triggerFileInput}
                        disabled={isUploading}
                    >
                        <div className="button-inner">
                            <span className="button-text">ENGAGE</span>
                            <span className="button-text">MANUAL</span>
                            <span className="button-text">OVERRIDE</span>
                            <span className="button-subtext">(Browse Files)</span>
                        </div>
                    </button>
                </div>

                <input
                    id="file-input"
                    type="file"
                    accept=".md,.txt,.markdown"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
};
