'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Animated background shapes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-gradient mb-6 animate-fade-in">
                        Master Chronology
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                        Transform markdown notes into interactive timelines. Learn through visualization, practice with drag-and-drop, and test your knowledge with AI-generated quizzes.
                    </p>
                    <Link href="/input">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 rounded-lg text-lg font-medium shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all"
                        >
                            Create Your Timeline
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        {
                            icon: '📝',
                            title: 'Markdown Input',
                            description: 'Simply paste your notes. Our AI extracts authors, works, and dates automatically.',
                        },
                        {
                            icon: '⏱️',
                            title: 'Interactive Timeline',
                            description: 'Visualize events chronologically with beautiful animations and smooth transitions.',
                        },
                        {
                            icon: '🎯',
                            title: 'Drag & Drop',
                            description: 'Practice chronological ordering through engaging drag-and-drop activities.',
                        },
                        {
                            icon: '📊',
                            title: 'AI Quizzes',
                            description: 'Test your knowledge with intelligently generated quiz questions.',
                        },
                        {
                            icon: '🎨',
                            title: 'Premium Design',
                            description: 'Enjoy a stunning dark-mode interface with glassmorphism effects.',
                        },
                        {
                            icon: '📱',
                            title: 'Mobile First',
                            description: 'Fully responsive design that works beautifully on all devices.',
                        },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass rounded-2xl p-6 glass-hover"
                        >
                            <div className="text-5xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-20"
                >
                    <p className="text-muted-foreground mb-4">Ready to start learning?</p>
                    <Link href="/input">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-medium transition-all"
                        >
                            Get Started
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
