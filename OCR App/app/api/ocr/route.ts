import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent([
            'Extract all text from this document. Return a JSON object with two fields: "title" (a short, descriptive title based on the document content) and "content" (the full extracted text in Markdown format). Do NOT wrap the content in code blocks.',
            {
                inlineData: {
                    data: base64,
                    mimeType: file.type,
                },
            },
        ]);

        const responseText = result.response.text();
        const responseData = JSON.parse(responseText);

        const document = await prisma.document.create({
            data: {
                originalName: file.name,
                title: responseData.title,
                extractedText: responseData.content,
            },
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error('OCR Error:', error);
        return NextResponse.json({ error: 'Failed to process document' }, { status: 500 });
    }
}
