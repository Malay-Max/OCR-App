'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface UploadAreaProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
}

export function UploadArea({ onFileSelect, isProcessing }: UploadAreaProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className={clsx(
                'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors',
                isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
                isProcessing && 'opacity-50 pointer-events-none'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
        >
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/*,application/pdf"
                onChange={handleChange}
            />
            <div className="flex flex-col items-center gap-4">
                {isProcessing ? (
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                ) : (
                    <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                )}
                <div className="text-gray-600 dark:text-gray-300">
                    {isProcessing ? (
                        <p className="text-lg font-medium">Processing document...</p>
                    ) : (
                        <>
                            <p className="text-lg font-medium">Click or drag file to upload</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">Supports Images and PDFs</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
