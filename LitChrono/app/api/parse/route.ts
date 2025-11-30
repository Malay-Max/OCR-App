import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Work {
    id: string;
    title: string;
    year: number;
    author: string;
}

export async function POST(request: Request) {
    try {
        const { markdown } = await request.json();
        console.log("=== PARSE API CALLED ===");
        console.log("Markdown length:", markdown?.length);
        console.log("First 200 chars:", markdown?.substring(0, 200));
        console.log("Markdown type:", typeof markdown);

        const lines = markdown.split("\n");
        console.log("Total lines:", lines.length);
        console.log("First 5 lines:", lines.slice(0, 5));

        const works: Work[] = [];
        let currentAuthorName = "Unknown";
        let currentAuthorId = "";

        // Regex patterns
        const authorRegex = /^##\s+(.+?)(?:\s*\((\d{4})?-?(\d{4})?\))?$/;
        const workRegex = /^-\s*(?:[*_]+)?(.+?)(?:[*_]+)?\s*\((\d{4})\).*$/;

        for (const line of lines) {
            const trimmed = line.trim();

            console.log("Processing line:", trimmed);

            // Detect Author
            const authorMatch = trimmed.match(authorRegex);
            if (authorMatch) {
                currentAuthorName = authorMatch[1].trim();
                console.log("✓ Found author:", currentAuthorName);

                // Find or create author in DB
                try {
                    const author = await prisma.author.upsert({
                        where: { name: currentAuthorName },
                        update: {},
                        create: {
                            name: currentAuthorName,
                            lifeSpan: authorMatch[2] ? `${authorMatch[2]}-${authorMatch[3] || ''}` : null,
                        },
                    });
                    currentAuthorId = author.id;
                    console.log("✓ Author saved/found with ID:", currentAuthorId);
                } catch (error) {
                    console.error("❌ Error saving author:", error);
                    throw error;
                }
                continue;
            }

            // Detect Work
            const workMatch = trimmed.match(workRegex);
            if (workMatch && currentAuthorId) {
                const title = workMatch[1].trim();
                const year = parseInt(workMatch[2]);
                console.log("✓ Found work:", title, year);

                // Find or create work
                try {
                    const existingWork = await prisma.work.findFirst({
                        where: {
                            title: title,
                            authorId: currentAuthorId,
                        },
                    });

                    if (!existingWork) {
                        await prisma.work.create({
                            data: {
                                title,
                                year,
                                authorId: currentAuthorId,
                            },
                        });
                        console.log("✓ Work saved:", title);
                    } else {
                        console.log("~ Work already exists:", title);
                    }
                } catch (error) {
                    console.error("❌ Error saving work:", error);
                    throw error;
                }
            }
        }

        // Fetch updated stats
        console.log("Fetching stats...");
        const authorCount = await prisma.author.count();
        const workCount = await prisma.work.count();
        console.log("Stats - Authors:", authorCount, "Works:", workCount);

        const allWorks = await prisma.work.findMany({
            include: { author: true },
        });

        const formattedWorks = allWorks.map(w => ({
            id: w.id,
            title: w.title,
            year: w.year,
            author: w.author.name,
        }));

        console.log("Returning", formattedWorks.length, "works");

        return NextResponse.json({
            works: formattedWorks,
            stats: {
                authorCount,
                workCount,
            },
        });
    } catch (error) {
        console.error("❌ Parse error:", error);
        return NextResponse.json(
            { error: "Failed to parse and save notes" },
            { status: 500 }
        );
    }
}
