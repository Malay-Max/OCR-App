"""
Gemini AI Service for extracting historical references from markdown text.
Uses structured output with JSON validation via Pydantic models.
"""
import json
import google.generativeai as genai
from typing import List
from app.config import settings
from app.models.schemas import AIResponseEnvelope, AIExtractedWork


# Configure Gemini AI
genai.configure(api_key=settings.gemini_api_key)


# System prompt for historical data extraction
SYSTEM_PROMPT = """You are a precise historical data extraction engine. Your task is to analyze text and extract ONLY historical references with specific years.

**STRICT RULES:**
1. Extract ONLY works, events, or historical references that have a SPECIFIC YEAR mentioned or strongly implied
2. Ignore any text that is not a historical reference (commentary, notes, personal thoughts, etc.)
3. For each item, extract:
   - title: The name of the work, event, or historical reference (cleaned and formatted)
   - author_or_source: The creator, author, or source if mentioned (null if not available)
   - year: The integer year (MUST be a valid year, not a century or range)
4. If an item mentions only a century or date range, ignore it unless you can determine a specific year
5. Return ONLY valid JSON in this exact structure:
   {
     "works": [
       {"title": "Example Work", "author_or_source": "Author Name", "year": 1984},
       {"title": "Another Event", "author_or_source": null, "year": 2001}
     ]
   }
6. If no valid historical references are found, return: {"works": []}

**OUTPUT FORMAT:** Return ONLY the JSON object. No explanations, no markdown formatting, no extra text."""


class AIService:
    """Service for interacting with Gemini AI."""
    
    def __init__(self):
        """Initialize the AI service with Gemini model."""
        self.model = genai.GenerativeModel(
            model_name="gemini-2.5-flash-lite",
            generation_config={
                "temperature": 0,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,
            }
        )
    
    async def extract_historical_works(self, markdown_content: str) -> List[AIExtractedWork]:
        """
        Extract historical works from markdown content using Gemini AI.
        
        Args:
            markdown_content: The raw markdown text to analyze
            
        Returns:
            List of AIExtractedWork objects
            
        Raises:
            ValueError: If AI response is invalid or cannot be parsed
            Exception: If Gemini API fails
        """
        try:
            # Combine system prompt and user content
            prompt = f"{SYSTEM_PROMPT}\n\n**TEXT TO ANALYZE:**\n{markdown_content}"
            
            # Generate response from Gemini
            response = self.model.generate_content(prompt)
            
            # Extract the JSON response
            response_text = response.text.strip()
            
            # Remove markdown code fences if present (```json ... ```)
            if response_text.startswith('```'):
                # Find the end of the opening fence
                first_newline = response_text.find('\n')
                if first_newline != -1:
                    response_text = response_text[first_newline + 1:]
                
                # Remove the closing fence
                if response_text.endswith('```'):
                    response_text = response_text[:-3].strip()
            
            # Parse JSON response
            try:
                response_data = json.loads(response_text)
            except json.JSONDecodeError as e:
                raise ValueError(f"AI returned invalid JSON: {str(e)}\nResponse: {response_text[:200]}")
            
            # Filter out items with None/null years before validation
            if 'works' in response_data and isinstance(response_data['works'], list):
                response_data['works'] = [
                    work for work in response_data['works'] 
                    if work.get('year') is not None
                ]
            
            # Validate against Pydantic model
            try:
                validated_response = AIResponseEnvelope(**response_data)
            except Exception as e:
                raise ValueError(f"AI response does not match expected schema: {str(e)}\nResponse: {response_data}")
            
            return validated_response.works
            
        except Exception as e:
            # Re-raise with more context
            raise Exception(f"Gemini AI extraction failed: {str(e)}")


# Global AI service instance
ai_service = AIService()
