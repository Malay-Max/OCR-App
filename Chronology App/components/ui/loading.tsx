'use client';

import { motion } from 'framer-motion';

interface LoadingProps {
    fullPage?: boolean;
    text?: string;
}

export default function Loading({ fullPage = false, text = 'Loading...' }: LoadingProps) {
    const spinner = (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
                className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            {text && <p className="text-muted-foreground animate-pulse">{text}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                {spinner}
            </div>
        );
    }

    return spinner;
}
