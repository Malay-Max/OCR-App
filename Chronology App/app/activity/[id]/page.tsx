'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DragDropGame from '@/components/activity/drag-drop-game';
import Loading from '@/components/ui/loading';
import Button from '@/components/ui/button';

interface Work {
    id: string;
    title: string;
    year: number;
    author: { name: string };
}

export default function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [noteId, setNoteId] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        params.then((resolvedParams) => {
            setNoteId(resolvedParams.id);
        });
    }, [params]);

    useEffect(() => {
        if (!noteId) return;

        async function fetchNote() {
            try {
                const response = await fetch(`/api/notes/${noteId}`);
                if (!response.ok) throw new Error('Failed to load note');

                const note = await response.json();
                const allWorks = note.authors?.flatMap((author: any) =>
                    author.works?.map((work: any) => ({ ...work, author })) || []
                ) || [];

                if (allWorks.length < 2) {
                    setError('Need at least 2 works to play this activity');
                } else {
                    setWorks(allWorks);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchNote();
    }, [noteId]);

    if (loading) return <Loading fullPage text="Preparing activity..." />;
    if (error) return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Link href={`/timeline/${noteId}`}>
                    <Button>Back to Timeline</Button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-8">
                    <Link href={`/timeline/${noteId}`}>
                        <Button variant="ghost">← Back to Timeline</Button>
                    </Link>
                </div>

                <DragDropGame
                    works={works.map((w) => ({
                        id: w.id,
                        title: w.title,
                        author: w.author.name,
                        year: w.year,
                    }))}
                />
            </div>
        </div>
    );
}
