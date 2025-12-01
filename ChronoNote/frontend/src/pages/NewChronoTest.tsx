import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SteampunkSidebar } from '../components/Layout/SteampunkSidebar';
import { getChronoTest, checkChronology } from '../services/api';
import type { ChronoTestWork } from '../types';
import './NewChronoTest.css';

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
            className="draggable-book"
        >
            <div className="book-spine">
                <div className="book-title">{work.title}</div>
                {work.author_or_source && (
                    <div className="book-author">{work.author_or_source}</div>
                )}
            </div>
        </div>
    );
};

export const NewChronoTest = () => {
    const [items, setItems] = useState<ChronoTestWork[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ correct: boolean } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTest = async () => {
            try {
                const response = await getChronoTest();
                setItems(response.works);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    navigate('/');
                } else {
                    console.error('Failed to load test:', error);
                }
            }
        };

        loadTest();
    }, [navigate]);

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
            setResult({ correct: response.correct });
        } catch (error) {
            console.error('Failed to check:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="steampunk-chrono-test">
            <SteampunkSidebar />

            <div className="chrono-content">
                <h1 className="page-title">TEMPORAL STABILIZER</h1>

                <div className="stabilizer-container">
                    {/* Vertical Energy Tube */}
                    <div className="energy-tube">
                        <div className="tube-glass">
                            <div className="energy-flow"></div>
                            <div className="energy-flow delay-1"></div>
                            <div className="energy-flow delay-2"></div>
                        </div>
                        <div className="tube-cap tube-cap-top"></div>
                        <div className="tube-cap tube-cap-bottom"></div>
                    </div>

                    {/* Draggable Books */}
                    <div className="books-container">
                        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                                <div className="books-stack">
                                    {items.map((work) => (
                                        <SortableItem key={work.id} work={work} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="action-container">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="temporal-lock-button"
                    >
                        <div className="button-inner">
                            <span className="button-text">ENGAGE</span>
                            <span className="button-text">TEMPORAL LOCK</span>
                            <span className="button-subtext">(Check Order)</span>
                        </div>
                    </button>
                </div>

                {/* Result Display */}
                {result && (
                    <div className={`result-panel ${result.correct ? 'correct' : 'incorrect'}`}>
                        <div className="result-text">
                            {result.correct ? '✓ CHRONOLOGY STABLE' : '✗ TEMPORAL ANOMALY DETECTED'}
                        </div>
                        {!result.correct && (
                            <button onClick={() => window.location.reload()} className="retry-button">
                                RECALIBRATE
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
