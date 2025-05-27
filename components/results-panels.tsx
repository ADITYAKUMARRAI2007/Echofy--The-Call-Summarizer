"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Results } from "@/components/audio-processor";
import { cn } from "@/lib/utils";

interface ResultsPanelsProps {
  results: Results;
}

export function ResultsPanels({ results }: ResultsPanelsProps) {
  const [activeTab, setActiveTab] = useState<string>("transcription");
  const [copied, setCopied] = useState<"none" | "transcription" | "summary">("none");
  
  const handleCopy = async (text: string, type: "transcription" | "summary") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied("none"), 2000);
  };
  
  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Tabs 
        defaultValue="transcription" 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="summary">AI Summary</TabsTrigger>
          </TabsList>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => handleCopy(
              activeTab === "transcription" ? results.transcription : results.summary,
              activeTab as "transcription" | "summary"
            )}
          >
            {copied === (activeTab as "transcription" | "summary") ? (
              <>
                <CheckIcon className="h-4 w-4 text-chart-2" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
        
        <TabsContent value="transcription" className="mt-0">
          <div className={cn(
            "p-6 rounded-lg border border-border/50 backdrop-blur-sm bg-card/30 max-h-[400px] overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20"
          )}>
            {results.transcription ? (
              <p className="whitespace-pre-line leading-relaxed">{results.transcription}</p>
            ) : (
              <p className="text-muted-foreground italic">No transcription available</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="summary" className="mt-0">
          <div className={cn(
            "p-6 rounded-lg border border-border/50 backdrop-blur-sm bg-card/30 max-h-[400px] overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20"
          )}>
            {results.summary ? (
              <p className="whitespace-pre-line leading-relaxed">{results.summary}</p>
            ) : (
              <p className="text-muted-foreground italic">No summary available</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}