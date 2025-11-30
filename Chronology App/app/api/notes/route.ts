import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { extractTimelineData } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
    try {
        const { markdown } = await request.json();

        if (!markdown || typeof markdown !== 'string') {
            return NextResponse.json(
                { error: 'Markdown content is required' },
                { status: 400 }
            );
        }

        // Extract timeline data using AI
        const extraction = await extractTimelineData(markdown);

        // Create note first
        const note = await prisma.note.create({
            data: {
                title: extraction.title,
                content: markdown,
            },
        });

        // Create authors and works with proper relationships
        for (const authorData of extraction.authors) {
            const author = await prisma.author.create({
                data: {
                    name: authorData.name,
                    noteId: note.id,
                },
            });

            // Create works for this author
            for (const workData of authorData.works) {
                await prisma.work.create({
                    data: {
                        title: workData.title,
                        publicationDate: workData.publicationDate,
                        year: workData.year,
                        authorId: author.id,
                        noteId: note.id,
                    },
                });
            }
        }

        // Fetch the complete note with all relations
        const completeNote = await prisma.note.findUnique({
            where: { id: note.id },
            include: {
                authors: {
                    include: {
                        works: true,
                    },
                },
            },
        });

        return NextResponse.json(completeNote);
    } catch (error: any) {
        console.error('Error processing note:', error);
        return NextResponse.json(
            { error: 'Failed to process note', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const notes = await prisma.note.findMany({
            include: {
                authors: {
                    include: {
                        works: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(notes);
    } catch (error: any) {
        console.error('Error fetching notes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notes' },
            { status: 500 }
        );
    }
}
