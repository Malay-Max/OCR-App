import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ExtractionResult } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MODEL_NAME = 'gemini-1.5-pro';

async function generateWithRetry(model: any, prompt: string, retries = 3, delay = 1000): Promise<any> {
  try {
    return await model.generateContent(prompt);
  } catch (error: any) {
    if (retries > 0 && (error.status === 429 || error.message?.includes('429'))) {
      console.log(`Rate limit hit, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateWithRetry(model, prompt, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function extractTimelineData(markdown: string): Promise<ExtractionResult> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `You are an expert at extracting structured chronological data from markdown text.

Extract the following information from this markdown content:
1. A descriptive title for the entire note (max 60 characters)
2. All authors mentioned
3. Their literary works or creative outputs
4. Publication dates (extract the year as a number)

Return the data as a JSON object with this exact structure:
{
  "title": "Brief descriptive title",
  "authors": [
    {
      "name": "Author Name",
      "works": [
        {
          "title": "Work Title",
          "publicationDate": "Full date string as appears in text",
          "year": numeric_year
        }
      ]
    }
  ]
}

IMPORTANT RULES:
- Extract ONLY factual information from the text
- Year must be a valid number (e.g., 1813, 1925)
- If date is approximate or unclear, use your best judgment
- publicationDate can be detailed (e.g., "March 1925"), but year must be the numeric year
- Title should summarize the theme or subject matter

Markdown content:
${markdown}

Return ONLY the JSON object, no additional text.`;

  const result = await generateWithRetry(model, prompt);
  const response = result.response.text();

  // Clean up the response - remove markdown code blocks if present
  let jsonText = response.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.slice(7);
  }
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.slice(3);
  }
  if (jsonText.endsWith('```')) {
    jsonText = jsonText.slice(0, -3);
  }

  const data: ExtractionResult = JSON.parse(jsonText.trim());
  return data;
}

export async function generateQuizQuestions(works: Array<{ title: string; author: string; year: number }>, count: number = 5) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const worksText = works.map(w => `- "${w.title}" by ${w.author} (${w.year})`).join('\n');

  const prompt = `Create ${count} quiz questions to test knowledge of chronological dates from these literary works:

${worksText}

Generate a mix of question types:
1. "When was [work] published?"
2. "Which work was published first: A or B?"
3. "Order these works chronologically"
4. "What year did [author] publish [work]?"

Return as a JSON array with this structure:
[
  {
    "question": "Question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Exact text of correct option"
  }
]

IMPORTANT:
- Make questions challenging but fair
- Options should be plausible
- correctAnswer must match one option exactly
- Include variety in question types
- For ordering questions, use format "A, B, C, D" in options

Return ONLY the JSON array, no additional text.`;

  const result = await generateWithRetry(model, prompt);
  const response = result.response.text();

  let jsonText = response.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.slice(7);
  }
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.slice(3);
  }
  if (jsonText.endsWith('```')) {
    jsonText = jsonText.slice(0, -3);
  }

  return JSON.parse(jsonText.trim());
}
