'use client';

import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import Button from '../ui/button';
import Card from '../ui/card';

interface Work {
    id: string;
    title: string;
    author: string;
    year: number;
}

interface DragDropGameProps {
    works: Work[];
}

function SortableWork({ work, isDragging }: { work: Work; isDragging?: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: work.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="glass rounded-lg p-4 cursor-grab active:cursor-grabbing glass-hover touch-none"
        >
            <div className="flex items-center gap-3">
                <div className="text-2xl">📖</div>
                <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{work.title}</h4>
                    <p className="text-sm text-muted-foreground">by {work.author}</p>
                </div>
                <div className="text-muted-foreground">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default function DragDropGame({ works }: DragDropGameProps) {
    const [items, setItems] = useState(() => {
        // Shuffle the works
        const shuffled = [...works].sort(() => Math.random() - 0.5);
        return shuffled;
    });
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const correctOrder = [...works].sort((a, b) => a.year - b.year);

    const checkOrder = () => {
        setAttempts(attempts + 1);
        const isCorrect = items.every((item, index) => item.id === correctOrder[index].id);

        if (isCorrect) {
            setIsComplete(true);
            // Trigger confetti!
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        }

        return isCorrect;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const reset = () => {
        setItems([...works].sort(() => Math.random() - 0.5));
        setIsComplete(false);
        setAttempts(0);
    };

    const activeWork = items.find((work) => work.id === activeId);

    return (
        <Card className="max-w-2xl mx-auto">
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gradient mb-2">
                        Chronology Challenge
                    </h2>
                    <p className="text-muted-foreground">
                        Drag and drop the works to arrange them in chronological order (earliest to latest)
                    </p>
                </div>

                {isComplete ? (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center space-y-4 py-8"
                    >
                        <div className="text-6xl">🎉</div>
                        <h3 className="text-3xl font-bold text-gradient">Perfect!</h3>
                        <p className="text-muted-foreground">
                            You arranged all works correctly in {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
                        </p>
                        <Button onClick={reset} size="lg">
                            Play Again
                        </Button>
                    </motion.div>
                ) : (
                    <>
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={items.map(w => w.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-3">
                                    {items.map((work) => (
                                        <SortableWork key={work.id} work={work} isDragging={work.id === activeId} />
                                    ))}
                                </div>
                            </SortableContext>

                            <DragOverlay>
                                {activeWork ? (
                                    <div className="glass rounded-lg p-4 shadow-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">📖</div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-foreground">{activeWork.title}</h4>
                                                <p className="text-sm text-muted-foreground">by {activeWork.author}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>

                        <div className="flex gap-3 justify-center">
                            <Button onClick={checkOrder} size="lg">
                                Check Answer
                            </Button>
                            <Button onClick={reset} variant="outline" size="lg">
                                Reset
                            </Button>
                        </div>

                        {attempts > 0 && !isComplete && (
                            <p className="text-center text-muted-foreground text-sm">
                                Attempts: {attempts}
                            </p>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
}
