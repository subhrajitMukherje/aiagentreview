"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ReviewButtonProps {
  selectedFile: string;
  fileContent: string;
  setReview: (review: string) => void;
}

export function ReviewButton({
  selectedFile,
  fileContent,
  setReview,
}: ReviewButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createReviewAgent = useAction(api.agent.createCodeReviewThread);

  const handleReview = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    try {
      const { text } = await createReviewAgent({
        prompt:
          "Please review this code and provide detailed feedback with line numbers.",
        code: fileContent,
      });

      setReview(text);
    } catch (error) {
      console.error("Error creating review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleReview} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Reviewing...
        </>
      ) : (
        "Review File"
      )}
    </Button>
  );
}
