import { NextRequest, NextResponse } from "next/server";
import { uploadAudio } from "@/lib/api-clients/assembly-ai";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.ASSEMBLYAI_API_KEY;

    if (!apiKey) {
      console.error("API KEY : " + apiKey);
      return NextResponse.json(
        { error: "AssemblyAI API key not configured" },
        { status: 500 }
      );
    }
    
    const audioUrl = await uploadAudio(file, apiKey);
    
    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error("Error uploading audio:", error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}