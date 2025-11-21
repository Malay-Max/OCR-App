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
            `Extract all text from this document and format it as proper Markdown. Return a JSON object with two fields:
1. "title": A short, descriptive title (3-5 words) based on the document content
2. "content": The full extracted text formatted with PROPER MARKDOWN SYNTAX following these rules:
   - Use # for main headings, ## for subheadings, ### for sub-subheadings
   - Convert all bullet points to markdown list format using "- " (dash + space)
   - Use **bold** for emphasis and *italics* where appropriate
   - Format tables using markdown table syntax with | and -
   - Use > for blockquotes
   - Maintain proper spacing and line breaks between sections
   - Do NOT use special characters like • or ◦ for bullets
   - Do NOT wrap the output in code blocks
   - Ensure the output is valid, well-formatted markdown that will render beautifully`,
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
