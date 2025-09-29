/**
 * Gemini Pro API client utility functions
 */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// ⚠️ Hardcoding API keys is insecure — but you asked to embed it directly.
const API_KEY = "AIzaSyBj6bCqsFeVJ-BvqCkslKiD5Z9FxqJ5wDA";

export interface GeminiResponse {
  summary: string;
}

export async function generateSummary(
  transcription: string
): Promise<{ summary: string }> {
  const prompt = `
You are an expert at summarizing audio transcriptions.

Please analyze the following transcription and return a summary in **bullet points**, using clear and concise language.

Format your response in two sections:

1. **Summary Points** – key points of the conversation or content in bullet points.
2. **Key Intakes** – the most important actionable items, conclusions, or takeaways.

Make sure both sections are easy to read and well-structured.

Transcription:
${transcription}
`;

  const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Gemini API Error:", error);
    throw new Error(
      `Gemini API error: ${error.error?.message || "Unknown error"}`
    );
  }

  const result = await response.json();
  const summaryText =
    result.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!summaryText) {
    throw new Error("Gemini API returned an empty response");
  }

  return {
    summary: summaryText,
  };
}
