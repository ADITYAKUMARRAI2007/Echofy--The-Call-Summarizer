import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 backdrop-blur-sm bg-background/80">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground max-w-6xl">
        <div className="mb-4 md:mb-0">
          Built with AssemblyAI + Gemini Pro
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://www.assemblyai.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            AssemblyAI
          </a>
          <a 
            href="https://ai.google.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Gemini Pro
          </a>
          <Button variant="ghost" size="icon" asChild>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}