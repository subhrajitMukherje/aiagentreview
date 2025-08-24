import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ReviewButton } from "./review-button";

interface FileContentProps {
  selectedFile: string;
  fileContent: string;
  highlightedLines: number[];
  lineComments: Record<number, string>;
  onLineClick: (lineNumber: number, e: React.MouseEvent) => void;
  setReview: (review: string) => void;
  showDialog: boolean;
  selectedLine: number | null;
  onCloseDialog: () => void;
}

export function FileContent({
  selectedFile,
  fileContent,
  highlightedLines,
  lineComments,
  onLineClick,
  setReview,
  showDialog,
  selectedLine,
  onCloseDialog,
}: FileContentProps) {
  console.log(lineComments);
  const getLanguageFromFileName = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "ts":
      case "tsx":
        return "typescript";
      case "js":
      case "jsx":
        return "javascript";
      case "css":
        return "css";
      case "html":
        return "html";
      case "json":
        return "json";
      case "md":
        return "markdown";
      default:
        return "text";
    }
  };

  const lineProps = (lineNumber: number) => {
    const isHighlighted = highlightedLines.includes(lineNumber);
    const comment = lineComments[lineNumber];
    console.log("Line number:", lineNumber, "Comment:", comment);

    return {
      style: {
        display: "block",
        backgroundColor: isHighlighted
          ? "rgba(255, 255, 0, 0.2)"
          : "transparent",
        borderLeft: isHighlighted ? "3px solid #ffd700" : "none",
        paddingLeft: isHighlighted ? "5px" : "0",
        transition: "background-color 0.2s ease",
        cursor: isHighlighted ? "pointer" : "default",
      },
      onClick: (e: React.MouseEvent) => {
        if (isHighlighted && comment) {
          console.log("Clicking line:", lineNumber, "Comment:", comment);
          onLineClick(lineNumber, e);
        }
      },
    };
  };

  return (
    <>
      <Card className='border-2 border-blue-200 lg:col-span-2'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>🗂️ File Content</CardTitle>
            {selectedFile && (
              <ReviewButton
                selectedFile={selectedFile}
                fileContent={fileContent}
                setReview={setReview}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className='flex-1'>
          <div className='h-[650px]'>
            <ScrollArea className='h-full'>
              {selectedFile ? (
                <div className='relative h-full'>
                  <div className='rounded-md overflow-hidden h-full'>
                    <SyntaxHighlighter
                      language={getLanguageFromFileName(selectedFile)}
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                      }}
                      showLineNumbers
                      wrapLines
                      lineProps={lineProps}
                    >
                      {fileContent}
                    </SyntaxHighlighter>
                  </div>
                </div>
              ) : (
                <div className='h-full flex items-center justify-center text-muted-foreground'>
                  <p>Select a file from the list to view its content</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={onCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Line {selectedLine}</DialogTitle>
          </DialogHeader>
          <div className='prose dark:prose-invert max-w-none text-sm'>
            <p className='whitespace-pre-wrap'>
              {selectedLine
                ? (() => {
                    console.log("Dialog - Selected Line:", selectedLine);
                    console.log("Dialog - Line Comments:", lineComments);
                    console.log(
                      "Dialog - Comment for selected line:",
                      lineComments[selectedLine]
                    );
                    return lineComments[selectedLine];
                  })()
                : ""}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
