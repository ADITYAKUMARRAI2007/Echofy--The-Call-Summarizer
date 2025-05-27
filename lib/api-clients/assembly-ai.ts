/**
 * Assembly AI client utility functions
 */

const API_BASE_URL = "https://api.assemblyai.com/v2";
export async function startTranscription(audioUrl: string, apiKey: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/transcript`, {
    method: "POST",
    headers: {
      "Authorization": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      language_code: "en",
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Upload failed: ${error.error || "Unknown error"}`);
  }

  const { upload_url } = await response.json();
  return upload_url;
}

export async function startTranscription(audioUrl: string, apiKey: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/transcript`, {
    method: "POST",
    headers: {
      "Authorization": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      language_code: "en",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Transcription start failed: ${error.error || "Unknown error"}`);
  }

  const { id } = await response.json();
  return id;
}

export interface TranscriptionStatus {
  status: "queued" | "processing" | "completed" | "error";
  text?: string;
  error?: string;
}

export async function getTranscriptionStatus(transcriptionId: string, apiKey: string): Promise<TranscriptionStatus> {
  const response = await fetch(`${API_BASE_URL}/transcript/${transcriptionId}`, {
    method: "GET",
    headers: {
      "Authorization": apiKey,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get transcription status: ${error.error || "Unknown error"}`);
  }

  const result = await response.json();
  
  if (result.status === "error") {
    return {
      status: "error",
      error: result.error || "Unknown transcription error",
    };
  }
  
  if (result.status === "completed") {
    return {
      status: "completed",
      text: result.text,
    };
  }
  
  return {
    status: result.status,
  };
}
