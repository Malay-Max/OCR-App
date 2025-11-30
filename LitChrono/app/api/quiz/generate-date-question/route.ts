import { NextResponse } from "next/server";

interface Work {
    id: string;
    title: string;
    year: number;
    author: string;
}

export async function POST(request: Request) {
    try {
        const { allWorks } = await request.json();

        if (!allWorks || allWorks.length === 0) {
            return NextResponse.json(
                { error: "No works available" },
                { status: 400 }
            );
        }

        // 1. Pick a random work
        const randomIndex = Math.floor(Math.random() * allWorks.length);
        const questionWork = allWorks[randomIndex];
        const correctYear = questionWork.year;

        // 2. Generate 3 unique distractors
        const options = new Set<number>();
        options.add(correctYear);

        while (options.size < 4) {
            // Generate random offset between -20 and +20, excluding 0
            let offset = Math.floor(Math.random() * 41) - 20;
            if (offset === 0) offset = 1;

            const distractor = correctYear + offset;

            // Ensure distractor is a realistic year (e.g., > 0) and not already in options
            if (distractor > 0 && !options.has(distractor)) {
                options.add(distractor);
            }
        }

        // 3. Shuffle options
        const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

        return NextResponse.json({
            question: questionWork,
            options: shuffledOptions,
            answer: correctYear,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to generate question" },
            { status: 500 }
        );
    }
}
