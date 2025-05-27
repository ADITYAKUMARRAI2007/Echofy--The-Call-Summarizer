import { NextRequest, NextResponse } from "next/server";
import { startTranscription } from "@/lib/api-clients/assembly-ai";

export async function POST(request: NextRequest) {
  try {
    const { audioUrl } = await request.json();
    
    if (!audioUrl) {
      return NextResponse.json(
        { error: "No audio URL provided" },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "AssemblyAI API key not configured" },
        { status: 500 }
      );
    }
    
    const transcriptionId = await startTranscription(audioUrl, apiKey);
    
    return NextResponse.json({ id: transcriptionId });
  } catch (error) {
    console.error("Error starting transcription:", error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}