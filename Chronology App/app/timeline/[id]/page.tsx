'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TimelineView from '@/components/timeline/timeline-view';
import Loading from '@/components/ui/loading';
import Button from '@/components/ui/button';
import { Note, Work, Author } from '@/lib/types';

export default function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [id, setId] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        params.then((resolvedParams) => {
            setId(resolvedParams.id);
        });
    }, [params]);

    useEffect(() => {
        if (!id) return;

        async function fetchNote() {
            try {
                const response = await fetch(`/api/notes/${id}`);
                if (!response.ok) throw new Error('Failed to load timeline');

                const data = await response.json();
                setNote(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchNote();
    }, [id]);

    if (loading) return <Loading fullPage text="Loading timeline..." />;
    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Link href="/input">
                    <Button>Create New Timeline</Button>
                </Link>
            </div>
        </div>
    );
    if (!note) return null;

    // Flatten works with author information
    const works: (Work & { author?: Author })[] = note.authors?.flatMap((author) =>
        author.works?.map((work) => ({ ...work, author })) || []
    ) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
                        {note.title}
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        {works.length} {works.length === 1 ? 'work' : 'works'} in timeline
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link href={`/activity/${id}`}>
                            <Button size="lg">
                                🎯 Practice Activity
                            </Button>
                        </Link>
                        <Link href={`/quiz/${id}`}>
                            <Button variant="secondary" size="lg">
                                📊 Take Quiz
                            </Button>
                        </Link>
                        <Link href="/input">
                            <Button variant="outline" size="lg">
                                ➕ New Timeline
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Timeline */}
                <TimelineView works={works} />
            </div>
        </div>
    );
}
