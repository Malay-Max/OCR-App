'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass rounded-2xl p-6 ${hover ? 'glass-hover card-hover' : ''} ${className}`}
        >
            {children}
        </motion.div>
    );
}
