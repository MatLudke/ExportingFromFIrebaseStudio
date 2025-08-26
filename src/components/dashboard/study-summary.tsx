"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { mockStudySessions } from "@/lib/mock-data";
import { generateSummary } from "@/ai/flows/generate-summary-flow";

export function StudySummary() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary("");
    try {
      const result = await generateSummary(mockStudySessions);
      setSummary(result);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar resumo",
        description: "Não foi possível conectar ao serviço de IA. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-xl shadow-black/5">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle className="text-2xl font-bold tracking-tight">Resumo Inteligente</CardTitle>
                <CardDescription>
                Use IA para analisar seu desempenho e obter insights.
                </CardDescription>
            </div>
            <Button onClick={handleGenerateSummary} disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Resumo com IA
            </Button>
        </div>
      </CardHeader>
      {(isLoading || summary) && (
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border bg-muted/30 p-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
                <p>{summary}</p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
