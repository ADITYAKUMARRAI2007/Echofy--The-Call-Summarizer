import { Waves } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center max-w-6xl">
        <div className="flex items-center gap-2">
          <Waves className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-chart-2">
            Echofy
          </h1>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Audio Transcription & AI Summarization
        </div>
      </div>
    </header>
  );
}