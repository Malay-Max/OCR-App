'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './ui/button';
import Card from './ui/card';

const SAMPLE_MARKDOWN = `# Classical Literature Timeline

- **Jane Austen** wrote *Pride and Prejudice* (1813) and *Emma* (1815)
- **Charles Dickens** authored *A Tale of Two Cities* (1859) and *Great Expectations* (1861)
- **Virginia Woolf** published *Mrs Dalloway* (1925) and *To the Lighthouse* (1927)
- **George Orwell** wrote *Animal Farm* (1945) and *1984* (1949)
- **Toni Morrison** published *The Bluest Eye* (1970) and *Beloved* (1987)
`;

export default function MarkdownInput() {
    const [markdown, setMarkdown] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        if (!markdown.trim()) {
            setError('Please enter some markdown content');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markdown }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to process markdown');
            }

            const note = await response.json();
            router.push(`/timeline/${note.id}`);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const loadSample = () => {
        setMarkdown(SAMPLE_MARKDOWN);
        setError('');
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold text-gradient mb-2">
                        Enter Your Timeline
                    </h2>
                    <p className="text-muted-foreground">
                        Paste markdown with authors, works, and publication dates. Our AI will extract the timeline data.
                    </p>
                </div>

                <div className="relative">
                    <textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        placeholder="# My Timeline&#10;&#10;- **Author Name** wrote *Work Title* (Year)&#10;- ..."
                        className="w-full h-64 px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                     text-foreground placeholder-muted-foreground resize-none
                     focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        disabled={loading}
                    />
                    <div className="absolute bottom-3 right-3 text-sm text-muted-foreground">
                        {markdown.length} characters
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                <div className="flex gap-3 flex-wrap">
                    <Button
                        onClick={handleSubmit}
                        loading={loading}
                        size="lg"
                    >
                        {loading ? 'Processing...' : 'Create Timeline'}
                    </Button>
                    <Button
                        onClick={loadSample}
                        variant="outline"
                        size="lg"
                        disabled={loading}
                    >
                        Load Sample
                    </Button>
                </div>
            </div>
        </Card>
    );
}
