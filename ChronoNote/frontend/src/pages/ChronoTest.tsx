/**
 * Chronology Test Page Component
 * Drag-and-drop test to order historical works chronologically.
 */
import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TimeMachineConsole } from '../components/Layout/TimeMachineConsole';
import { ConsoleSidebar } from '../components/Layout/ConsoleSidebar';
import { getChronoTest, checkChronology } from '../services/api';
import { useTimelineStore } from '../store/timelineStore';
import type { ChronoTestWork } from '../types';

const SortableItem: React.FC<{ work: ChronoTestWork }> = ({ work }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: work.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="leather-panel p-4 cursor-grab active:cursor-grabbing mb-3 hover:shadow-glow-brass"
        >
            <h4 className="font-brass text-lg text-brass-300">{work.title}</h4>
            {work.author_or_source && (
                <p className="font-mono text-sm text-brass-400">by {work.author_or_source}</p>
            )}
        </div>
    );
};

export const ChronoTest: React.FC = () => {
    const { setChronoTestWorks, chronoTestResult, setChronoTestResult } = useTimelineStore();
    const [items, setItems] = useState<ChronoTestWork[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadTest = async () => {
            try {
                const response = await getChronoTest();
                setChronoTestWorks(response.works);
                setItems(response.works);
            } catch (error) {
                console.error('Failed to load chronology test:', error);
            }
        };

        loadTest();
    }, [setChronoTestWorks]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const orderedIds = items.map(item => item.id);
            const response = await checkChronology({ ordered_ids: orderedIds });
            setChronoTestResult({
                correct: response.correct,
                correctOrder: response.correct_order,
            });
        } catch (error) {
            console.error('Failed to check chronology:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <TimeMachineConsole>
            <ConsoleSidebar />

            <div className="ml-48 pr-8">
                <h1 className="font-brass text-4xl text-brass-400 mb-4 text-center">
                    CHRONOLOGY TEST
                </h1>
                <p className="font-mono text-brass-400 text-center mb-8">
                    Drag and drop to arrange in chronological order
                </p>

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        <div className="max-w-2xl mx-auto">
                            {items.map((work) => (
                                <SortableItem key={work.id} work={work} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <div className="text-center mt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="btn-electric px-12 py-4 text-lg"
                    >
                        {isSubmitting ? 'CHECKING...' : 'ENGAGE TEMPORAL LOCK'}
                    </button>
                </div>

                {chronoTestResult && (
                    <div className={`mt-8 p-6 rounded-lg text-center ${chronoTestResult.correct
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : 'bg-red-500/20 border-2 border-red-500'
                        }`}>
                        <p className="font-brass text-2xl mb-2">
                            {chronoTestResult.correct ? '✓ CORRECT!' : '✗ INCORRECT'}
                        </p>
                        {!chronoTestResult.correct && (
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-brass mt-4"
                            >
                                TRY AGAIN
                            </button>
                        )}
                    </div>
                )}
            </div>
        </TimeMachineConsole>
    );
};
