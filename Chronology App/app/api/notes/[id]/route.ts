import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const note = await prisma.note.findUnique({
            where: { id },
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

        return NextResponse.json(note);
    } catch (error: any) {
        console.error('Error fetching note:', error);
        return NextResponse.json(
            { error: 'Failed to fetch note' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.note.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting note:', error);
        return NextResponse.json(
            { error: 'Failed to delete note' },
            { status: 500 }
        );
    }
}
