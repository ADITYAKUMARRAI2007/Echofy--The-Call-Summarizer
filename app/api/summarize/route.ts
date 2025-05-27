import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/lib/api-clients/gemini";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: "No text provided for summarization" },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }
    
    const result = await generateSummary(text, apiKey);
    
    return NextResponse.json({ summary: result.summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}