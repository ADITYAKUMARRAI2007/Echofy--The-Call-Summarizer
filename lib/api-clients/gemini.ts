/**
 * Gemini Pro API client utility functions
 */

// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-default:generateContent";
// export interface GeminiResponse {
//   summary: string;
// }

// export async function generateSummary(transcription: string, apiKey: string): Promise<GeminiResponse> {
//   const prompt = `
//     You are an expert at summarizing audio transcriptions. 
//     Please provide a concise, well-structured summary of the following transcription. 
//     Focus on the main points, key insights, and important details.
//     If the transcription appears to be from a meeting, extract action items and decisions.
//     If it's educational, highlight the main concepts and learnings.
//     If it's conversational, summarize the key themes and topics discussed.
    
//     Transcription:
//     ${transcription}
//   `;

//   const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [
//             {
//               text: prompt,
//             }
//           ]
//         }
//       ],
//       generationConfig: {
//         temperature: 0.2,
//         topK: 40,
//         topP: 0.95,
//         maxOutputTokens: 1024,
//       },
//     }),
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(`Gemini API error: ${error.error?.message || "Unknown error"}`);
//   }

//   const result = await response.json();
//   const summaryText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

//   if (!summaryText) {
//     throw new Error("Gemini API returned an empty response");
//   }

//   return {
//     summary: summaryText,
//   };
// }






/**
 * Gemini Pro API client utility functions
 */


const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
export interface GeminiResponse {
  summary: string;
}
export async function generateSummary(transcription: string, apiKey: string): Promise<{ summary: string }> {
  const prompt = `
    You are an expert at summarizing audio transcriptions. 
    Please provide a concise, well-structured summary of the following transcription. 
    Focus on the main points, key insights, and important details.

    Transcription:
    ${transcription}
  `;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
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
    throw new Error(`Gemini API error: ${error.error?.message || "Unknown error"}`);
  }

  const result = await response.json();
  const summaryText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!summaryText) {
    throw new Error("Gemini API returned an empty response");
  }

  return {
    summary: summaryText,
  };
}