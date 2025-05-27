import { NextRequest, NextResponse } from "next/server";
import { getTranscriptionStatus } from "@/lib/api-clients/assembly-ai";

// This is a server route
export const dynamic = 'force-dynamic';
const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "No transcription ID provided" },
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
    
    const status = await getTranscriptionStatus(id, apiKey);
    
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error polling transcription:", error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
export { GET };