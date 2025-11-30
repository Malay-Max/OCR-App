import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateQuizQuestions } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
    try {
        const { noteId, count = 5 } = await request.json();

        if (!noteId) {
            return NextResponse.json(
                { error: 'Note ID is required' },
                { status: 400 }
            );
        }

        // Fetch note with works
        const note = await prisma.note.findUnique({
            where: { id: noteId },
            include: {
                authors: {
                    include: {
                        works: true,
                    },
                },
            },
        });

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        // Prepare works for quiz generation
        const works = note.authors.flatMap((author) =>
            author.works.map((work) => ({
                title: work.title,
                author: author.name,
                year: work.year,
            }))
        );

        if (works.length < 2) {
            return NextResponse.json(
                { error: 'At least 2 works are required to generate a quiz' },
                { status: 400 }
            );
        }

        // Generate quiz questions
        const questions = await generateQuizQuestions(works, Math.min(count, 10));

        // Create quiz session
        const session = await prisma.quizSession.create({
            data: {
                noteId,
                score: 0,
                totalQuestions: questions.length,
                questions: {
                    create: questions.map((q: any) => ({
                        question: q.question,
                        options: JSON.stringify(q.options),
                        correctAnswer: q.correctAnswer,
                    })),
                },
            },
            include: {
                questions: true,
            },
        });

        return NextResponse.json({
            sessionId: session.id,
            questions: session.questions.map((q) => ({
                id: q.id,
                question: q.question,
                options: JSON.parse(q.options),
                correctAnswer: q.correctAnswer,
            })),
        });
    } catch (error: any) {
        console.error('Error generating quiz:', error);
        return NextResponse.json(
            { error: 'Failed to generate quiz', details: error.message },
            { status: 500 }
        );
    }
}
