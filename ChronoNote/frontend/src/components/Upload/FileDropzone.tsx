/**
 * File Dropzone Component
 * Drag-and-drop file upload with glowing border effects.
 */
import React, { useCallback, useState } from 'react';

interface FileDropzoneProps {
    onFileSelect: (file: File) => void;
    isUploading: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelect, isUploading }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.match(/\.(md|txt|markdown)$/i)) {
                onFileSelect(file);
            } else {
                alert('Please upload a .md, .txt, or .markdown file');
            }
        }
    }, [onFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
    }, [onFileSelect]);

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
        relative mt-8 p-12 rounded-xl border-4 border-dashed
        transition-all duration-300 cursor-pointer
        ${isDragging
                    ? 'border-electric-400 bg-electric-500/20 shadow-glow-electric scale-105'
                    : 'border-brass-500 bg-brass-500/10 hover:border-brass-400 hover:shadow-glow-brass'
                }
        ${isUploading ? 'pointer-events-none opacity-50' : ''}
      `}
        >
            {/* File input (hidden) */}
            <input
                type="file"
                accept=".md,.txt,.markdown"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
            />

            {/* Dropzone content */}
            <div className="text-center pointer-events-none">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="font-brass text-2xl text-brass-300 mb-2">
                    {isDragging ? 'RELEASE TO UPLOAD' : 'DROP MARKDOWN FILE'}
                </h3>
                <p className="font-mono text-sm text-brass-400">
                    or click to browse
                </p>
                <p className="font-mono text-xs text-brass-500 mt-4">
                    Accepted formats: .md, .txt, .markdown (Max 50KB)
                </p>
            </div>

            {/* Glowing corners when dragging */}
            {isDragging && (
                <>
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-electric-400" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-electric-400" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-electric-400" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-electric-400" />
                </>
            )}
        </div>
    );
};
