"use client";

import { useNotes, Work } from "@/context/NotesContext";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function SortableItem({ work, showResult, isCorrectPosition }: { work: Work; showResult: boolean; isCorrectPosition: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: work.id, disabled: showResult });

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
            className={`bg-white p-4 rounded-xl shadow-sm border mb-3 flex items-center justify-between cursor-grab active:cursor-grabbing touch-none ${showResult
                    ? isCorrectPosition
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    : "border-stone-200 hover:border-amber-400"
                }`}
        >
            <div>
                <h3 className="font-serif font-bold text-stone-800">{work.title}</h3>
                <p className="text-sm text-stone-600">{work.author}</p>
            </div>
            {showResult && (
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-700">{work.year}</span>
                    {isCorrectPosition ? (
                        <Check className="text-green-600" size={20} />
                    ) : (
                        <X className="text-red-600" size={20} />
                    )}
                </div>
            )}
        </div>
    );
}

export default function OrderQuizPage() {
    const { parsedWorks } = useNotes();
    const [items, setItems] = useState<Work[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const startNewRound = () => {
        if (parsedWorks.length < 2) return;

        // Pick 5 random works
        const shuffled = [...parsedWorks].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setItems(selected);
        setShowResult(false);
    };

    useEffect(() => {
        startNewRound();
    }, [parsedWorks]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const checkOrder = () => {
        setShowResult(true);

        // Check if sorted by year
        const isCorrect = items.every((item, index) => {
            if (index === 0) return true;
            return item.year >= items[index - 1].year;
        });

        if (isCorrect) {
            setScore(s => s + 100);
        }
    };

    // Helper to check individual item position for UI feedback
    // This is tricky because there could be multiple valid sorts if years are same.
    // But for simple feedback, we can check if the current list is sorted relative to itself.
    // Actually, the requirement says "Highlight correct positions".
    // A simple way is to compare the current index with the index in a sorted version of the CURRENT items.
    const sortedItems = [...items].sort((a, b) => a.year - b.year);

    return (
        <main className="min-h-screen p-8 max-w-2xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Exit</span>
                </Link>
                <div className="font-mono text-amber-600 font-bold">Score: {score}</div>
            </header>

            <div className="text-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">
                    Chronology Challenge
                </h1>
                <p className="text-stone-600">
                    Drag the works into the correct chronological order (Oldest to Newest).
                </p>
            </div>

            {items.length < 2 ? (
                <div className="text-center p-8 bg-amber-50 rounded-xl text-amber-800">
                    Add more works in the Editor to play this game!
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2 mb-8">
                            {items.map((work, index) => (
                                <SortableItem
                                    key={work.id}
                                    work={work}
                                    showResult={showResult}
                                    isCorrectPosition={work.id === sortedItems[index].id}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <div className="flex justify-center gap-4">
                {!showResult ? (
                    <button
                        onClick={checkOrder}
                        disabled={items.length < 2}
                        className="bg-stone-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-stone-700 transition-colors disabled:opacity-50"
                    >
                        Check Order
                    </button>
                ) : (
                    <button
                        onClick={startNewRound}
                        className="flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-700 transition-colors"
                    >
                        <RefreshCw size={20} />
                        <span>Next Round</span>
                    </button>
                )}
            </div>
        </main>
    );
}
