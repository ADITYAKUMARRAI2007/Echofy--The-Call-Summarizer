// "use client";

// import { useState } from "react";
// import { AudioUploader } from "@/components/audio-uploader";
// import { ResultsPanels } from "@/components/results-panels";
// import { ProcessingSteps } from "@/components/processing-steps";
// import { Card, CardContent } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";

// export type AudioFile = File;

// export type ProcessingStatus = {
//   stage: "idle" | "uploading" | "transcribing" | "summarizing" | "complete" | "error";
//   progress?: number;
//   error?: string;
// };

// export type Results = {
//   transcription: string;
//   summary: string;
// };

// export function AudioProcessor() {
//   const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
//   const [status, setStatus] = useState<ProcessingStatus>({ stage: "idle" });
//   const [results, setResults] = useState<Results | null>(null);
//   const { toast } = useToast();

//   const handleFileSelected = async (file: AudioFile) => {
//     setAudioFile(file);
//     setStatus({ stage: "uploading", progress: 0 });
    
//     try {
//       // Create form data with the audio file
//       console.log("Creating form data");
//       const formData = new FormData();
//       formData.append("file", file);
      
//       // Upload the file to AssemblyAI
//       console.log("Uploading to /api/transcribe/upload");
//       setStatus({ stage: "uploading", progress: 30 });
//       const uploadResponse = await fetch("/api/transcribe/upload", {
//         method: "POST",
//         body: formData,
//       });
//       console.log("Upload response status:", uploadResponse.status);
//       const textResponse = await uploadResponse.text();
//       console.log("Upload response body:", textResponse);
      
//       if (!uploadResponse.ok) {
//         throw new Error("Failed to upload audio file");
//       }
      
//       const { audioUrl } = JSON.parse(textResponse);
      
//       // Start transcription
//       setStatus({ stage: "transcribing", progress: 50 });
//       const transcribeResponse = await fetch("/api/transcribe/start", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ audioUrl }),
//       });
      
//       if (!transcribeResponse.ok) {
//         throw new Error("Failed to start transcription");
//       }
      
//       const { id: transcriptionId } = await transcribeResponse.json();
      
//       // Poll for transcription completion
//       let transcriptionComplete = false;
//       let transcriptionText = "";
      
//       while (!transcriptionComplete) {
//         const pollResponse = await fetch(`/api/transcribe/poll?id=${transcriptionId}`);
//         if (!pollResponse.ok) {
//           throw new Error("Failed to poll transcription status");
//         }
        
//         const pollResult = await pollResponse.json();
        
//         if (pollResult.status === "completed") {
//           transcriptionComplete = true;
//           transcriptionText = pollResult.text;
//         } else if (pollResult.status === "error") {
//           throw new Error("Transcription failed: " + pollResult.error);
//         } else {
//           // Wait 2 seconds before polling again
//           await new Promise(resolve => setTimeout(resolve, 2000));
//         }
//       }
      
//       // Get summary from Gemini
//       setStatus({ stage: "summarizing", progress: 80 });
//       const summaryResponse = await fetch("/api/summarize", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text: transcriptionText }),
//       });
      
//       if (!summaryResponse.ok) {
//         throw new Error("Failed to generate summary");
//       }
      
//       const { summary } = await summaryResponse.json();
      
//       // Set results and complete status
//       setResults({
//         transcription: transcriptionText,
//         summary,
//       });
      
//       setStatus({ stage: "complete", progress: 100 });
      
//       toast({
//         title: "Processing complete",
//         description: "Your audio has been transcribed and summarized successfully!",
//       });
//     } catch (error) {
//       console.error("Processing error:", error);
//       setStatus({ 
//         stage: "error", 
//         error: error instanceof Error ? error.message : "An unknown error occurred" 
//       });
      
//       toast({
//         variant: "destructive",
//         title: "Processing failed",
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//       });
//     }
//   };

//   const handleRetry = () => {
//     setStatus({ stage: "idle" });
//     setResults(null);
//     setAudioFile(null);
//   };

//   return (
//     <div className="space-y-8">
//       <section className="max-w-2xl mx-auto text-center mb-12">
//         <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-chart-2">
//           Audio to Insights
//         </h2>
//         <p className="text-muted-foreground">
//           Upload your audio files to get accurate transcriptions and AI-powered summaries in seconds.
//         </p>
//       </section>

//       {status.stage === "idle" ? (
//         <AudioUploader onFileSelected={handleFileSelected} />
//       ) : (
//         <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
//           <CardContent className="p-6">
//             <ProcessingSteps status={status} fileName={audioFile?.name} onRetry={handleRetry} />
            
//             {status.stage === "complete" && results && (
//               <ResultsPanels results={results} />
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { AudioUploader } from "@/components/audio-uploader";
import { ResultsPanels } from "@/components/results-panels";
import { ProcessingSteps } from "@/components/processing-steps";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export type AudioFile = File;

export type ProcessingStatus = {
  stage: "idle" | "uploading" | "transcribing" | "summarizing" | "complete" | "error";
  progress?: number;
  error?: string;
};

export type Results = {
  transcription: string;
  summary: string;
};

export function AudioProcessor() {
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>({ stage: "idle" });
  const [results, setResults] = useState<Results | null>(null);
  const { toast } = useToast();

  const handleFileSelected = async (file: AudioFile) => {
    setAudioFile(file);
    setStatus({ stage: "uploading", progress: 0 });

    try {
      const formData = new FormData();
      formData.append("file", file);

      setStatus({ stage: "uploading", progress: 30 });
      const uploadResponse = await fetch("/api/transcribe/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Failed to upload audio file: ${errorText}`);
      }

      const { audioUrl } = await uploadResponse.json();

      setStatus({ stage: "transcribing", progress: 50 });
      const transcribeResponse = await fetch("/api/transcribe/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl }),
      });

      if (!transcribeResponse.ok) {
        const errorText = await transcribeResponse.text();
        throw new Error(`Failed to start transcription: ${errorText}`);
      }

      const { id: transcriptionId } = await transcribeResponse.json();

      let transcriptionComplete = false;
      let transcriptionText = "";

      while (!transcriptionComplete) {
        const pollResponse = await fetch(`/api/transcribe/poll?id=${transcriptionId}`);
        if (!pollResponse.ok) {
          const errorText = await pollResponse.text();
          throw new Error(`Failed to poll transcription status: ${errorText}`);
        }

        const pollResult = await pollResponse.json();

        if (pollResult.status === "completed") {
          transcriptionComplete = true;
          transcriptionText = pollResult.text;
        } else if (pollResult.status === "error") {
          throw new Error(`Transcription failed: ${pollResult.error}`);
        } else {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      setStatus({ stage: "summarizing", progress: 80 });
      const summaryResponse = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcriptionText }),
      });

      if (!summaryResponse.ok) {
        const errorText = await summaryResponse.text();
        throw new Error(`Failed to generate summary: ${errorText}`);
      }

      const { summary } = await summaryResponse.json();

      setResults({ transcription: transcriptionText, summary });
      setStatus({ stage: "complete", progress: 100 });

      toast({
        title: "Processing complete",
        description: "Your audio has been transcribed and summarized successfully!",
      });
    } catch (error) {
      console.error("Processing error:", error);
      setStatus({
        stage: "error",
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });

      toast({
        variant: "destructive",
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleRetry = () => {
    setStatus({ stage: "idle" });
    setResults(null);
    setAudioFile(null);
  };

  return (
    <div className="space-y-8">
      <section className="max-w-2xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-chart-2">
          Audio to Insights
        </h2>
        <p className="text-muted-foreground">
          Upload your audio files to get accurate transcriptions and AI-powered summaries in seconds.
        </p>
      </section>

      {status.stage === "idle" ? (
        <AudioUploader onFileSelected={handleFileSelected} />
      ) : (
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <ProcessingSteps status={status} fileName={audioFile?.name} onRetry={handleRetry} />
            {status.stage === "complete" && results && <ResultsPanels results={results} />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}




