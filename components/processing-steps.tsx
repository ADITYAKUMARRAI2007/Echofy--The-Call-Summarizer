"use client";

import { Mic, FileText, Brain, AlertCircle, Loader2, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProcessingStatus } from "@/components/audio-processor";
import { cn } from "@/lib/utils";

interface ProcessingStepsProps {
  status: ProcessingStatus;
  fileName?: string;
  onRetry: () => void;
}

export function ProcessingSteps({ status, fileName, onRetry }: ProcessingStepsProps) {
  const isComplete = status.stage === "complete";
  const isError = status.stage === "error";
  
  return (
    <div className="mb-8">
      {fileName && (
        <div className="mb-4 text-center">
          <p className="text-muted-foreground">
            Processing: <span className="font-medium text-foreground">{fileName}</span>
          </p>
        </div>
      )}
      
      {!isError && (
        <div className="mb-6">
          <Progress value={status.progress} className="h-2 bg-muted/50" />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Transcription Step */}
        <div className={cn(
          "p-4 rounded-lg border border-border/50 backdrop-blur-sm bg-card/30 flex items-center gap-3",
          status.stage === "transcribing" && "ring-1 ring-primary/50",
          (isComplete || status.stage === "summarizing") && "text-muted-foreground"
        )}>
          {status.stage === "transcribing" ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (status.stage === "summarizing" || isComplete) ? (
            <CheckCircle className="h-5 w-5 text-chart-2" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
          <span>Transcribing Audio</span>
        </div>
        
        {/* Summarization Step */}
        <div className={cn(
          "p-4 rounded-lg border border-border/50 backdrop-blur-sm bg-card/30 flex items-center gap-3",
          status.stage === "summarizing" && "ring-1 ring-primary/50",
          isComplete && "text-muted-foreground"
        )}>
          {status.stage === "summarizing" ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : isComplete ? (
            <CheckCircle className="h-5 w-5 text-chart-2" />
          ) : (
            <Brain className="h-5 w-5" />
          )}
          <span>Generating Summary</span>
        </div>
        
        {/* Completion Step */}
        <div className={cn(
          "p-4 rounded-lg border border-border/50 backdrop-blur-sm bg-card/30 flex items-center gap-3",
          isComplete && "ring-1 ring-primary/50"
        )}>
          {isComplete ? (
            <CheckCircle className="h-5 w-5 text-chart-2" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
          <span>Results Ready</span>
        </div>
      </div>
      
      {isError && (
        <div className="mt-6 p-4 rounded-lg border border-destructive/50 bg-destructive/10 flex flex-col items-center text-center">
          <AlertCircle className="h-6 w-6 text-destructive mb-2" />
          <h3 className="font-medium mb-1">Processing Failed</h3>
          <p className="text-sm text-muted-foreground mb-4">{status.error}</p>
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}