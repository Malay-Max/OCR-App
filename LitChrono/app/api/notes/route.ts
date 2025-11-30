import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const authors = await prisma.author.count();
        const works = await prisma.work.findMany({
            include: { author: true },
        });

        const formattedWorks = works.map(w => ({
            id: w.id,
            title: w.title,
            year: w.year,
            author: w.author.name,
        }));

        return NextResponse.json({
            works: formattedWorks,
            stats: {
                authorCount: authors,
                workCount: works.length,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch notes" },
            { status: 500 }
        );
    }
}
