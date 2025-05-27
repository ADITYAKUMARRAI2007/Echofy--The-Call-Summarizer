"use client";

import { useState, useRef } from "react";
import { Upload, FileAudio, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AudioFile } from "@/components/audio-processor";

interface AudioUploaderProps {
  onFileSelected: (file: AudioFile) => void;
}

export function AudioUploader({ onFileSelected }: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (files.length === 0) return;
    
    const file = files[0];
    const validTypes = [
      "audio/mpeg", // mp3
      "audio/wav", // wav
      "audio/x-m4a", // m4a
      "audio/mp4", // m4a alternative MIME type
    ];
    
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an MP3, WAV, or M4A audio file.",
      });
      return;
    }
    
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  };

  return (
    <Card className={cn(
      "border border-border/50 backdrop-blur-sm bg-card/50 transition-all duration-300",
      isDragging && "border-primary border-dashed scale-102 shadow-glow"
    )}>
      <CardContent className="p-6">
        <div 
          className="flex flex-col items-center justify-center p-8 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <>
              <div className="mb-4 rounded-full bg-primary/10 p-4 ring-1 ring-primary/20">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Upload your audio file</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Drag and drop your audio file here, or click to browse. We support MP3, WAV, and M4A formats.
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Select Audio File</span>
                <span className="absolute inset-0 bg-gradient-to-r from-chart-1/60 to-chart-2/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".mp3,.wav,.m4a"
                className="hidden"
              />
            </>
          ) : (
            <>
              <div className="w-full bg-background/50 rounded-lg p-4 mb-6 flex items-center gap-4 border border-border/30">
                <div className="rounded-full bg-primary/10 p-2 ring-1 ring-primary/20 flex-shrink-0">
                  <FileAudio className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRemoveFile}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={handleSubmit}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Process Audio</span>
                <span className="absolute inset-0 bg-gradient-to-r from-chart-1/60 to-chart-2/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}