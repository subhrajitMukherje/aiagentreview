"use client";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const formatMarkdown = (text: string) => {
    // Replace headings
    text = text.replace(
      /^#\s+(.*$)/gm,
      '<h1 class="text-2xl font-bold text-pink-500 mb-4">$1</h1>'
    );
    text = text.replace(
      /^##\s+(.*$)/gm,
      '<h2 class="text-xl font-bold text-pink-500 mb-3">$1</h2>'
    );
    text = text.replace(
      /^###\s+(.*$)/gm,
      '<h3 class="text-lg font-bold text-pink-500 mb-2">$1</h3>'
    );
    text = text.replace(
      /^####\s+(.*$)/gm,
      '<h4 class="text-base font-bold text-pink-500 mb-2">$1</h4>'
    );

    // Replace code blocks
    text = text.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (match, language, code) => {
        return `<div class="my-4"><SyntaxHighlighter language="${language || "text"}" style={vscDarkPlus}>${code.trim()}</SyntaxHighlighter></div>`;
      }
    );

    // Replace inline code
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-1 rounded">$1</code>'
    );

    // Replace lists
    text = text.replace(/^\s*-\s+(.*$)/gm, '<li class="mb-1">$1</li>');
    text = text.replace(
      /<li/g,
      '<ul class="list-disc pl-6 text-muted-foreground mb-2"><li'
    );
    text = text.replace(/<\/li>/g, "</li></ul>");

    // Replace bold
    text = text.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="text-pink-500">$1</strong>'
    );

    // Replace paragraphs
    text = text.replace(
      /^(?!<[a-z])(.*$)/gm,
      '<p class="text-muted-foreground mb-2">$1</p>'
    );

    return text;
  };

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
    </div>
  );
}
