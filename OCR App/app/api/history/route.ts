import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const documents = await prisma.document.findMany({
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(documents);
    } catch (error) {
        console.error('History Error:', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
