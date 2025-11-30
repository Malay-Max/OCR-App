import MarkdownInput from '@/components/markdown-input';

export default function InputPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-20 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
                        Create Timeline
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Transform your markdown notes into an interactive learning experience
                    </p>
                </div>

                <MarkdownInput />
            </div>
        </div>
    );
}
