import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { sessionId, answers } = await request.json();

        if (!sessionId || !answers) {
            return NextResponse.json(
                { error: 'Session ID and answers are required' },
                { status: 400 }
            );
        }

        // Update each question with user answer
        let correctCount = 0;
        for (const answer of answers) {
            const question = await prisma.quizQuestion.findUnique({
                where: { id: answer.questionId },
            });

            if (question) {
                const isCorrect = question.correctAnswer === answer.userAnswer;
                if (isCorrect) correctCount++;

                await prisma.quizQuestion.update({
                    where: { id: answer.questionId },
                    data: {
                        userAnswer: answer.userAnswer,
                        isCorrect,
                    },
                });
            }
        }

        // Update session with final score
        const session = await prisma.quizSession.update({
            where: { id: sessionId },
            data: {
                score: correctCount,
            },
            include: {
                questions: true,
            },
        });

        return NextResponse.json({
            score: correctCount,
            totalQuestions: session.totalQuestions,
            percentage: Math.round((correctCount / session.totalQuestions) * 100),
            questions: session.questions,
        });
    } catch (error: any) {
        console.error('Error submitting quiz:', error);
        return NextResponse.json(
            { error: 'Failed to submit quiz' },
            { status: 500 }
        );
    }
}
