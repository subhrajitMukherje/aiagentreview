import { ReviewClient } from "@/components/review-client";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const getAllFilesFromGit = async () => {
  try {
    // List all files, excluding .git, .next, and node_modules
    const { stdout } = await execAsync(
      'find . -type f -not -path "./.git/*" -not -path "./.next/*" -not -path "*/node_modules/*"'
    );

    // Process the output to get file names
    const files = stdout
      .split("\n")
      .filter((file) => file.trim() !== "")
      .map((file) => file.trim().replace("./", "")); // Remove leading ./

    return { files };
  } catch (error) {
    console.error("Error listing files:", error);
  }
};

async function getSelectedFile(filePath: string) {
  try {
    if (!filePath) {
      return { error: "File path is required" };
    }

    // Get the content of the file
    const { stdout } = await execAsync(`cat ${filePath}`);

    return { content: stdout };
  } catch (error) {
    console.error("Error fetching file content:", error);
    return { error: "Failed to fetch file content" };
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ path: string }>;
}) {
  const { path } = await searchParams;
  const data = await getAllFilesFromGit();
  const selectedFile = await getSelectedFile(path);

  console.log(data);

  return (
    <div className=''>
      <header className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Code Review AI Agent</h1>
      </header>

      <div className='page-container'>
        <h2 className='text-xl font-bold'>
          Hi! I&apos;m Code Review Agent, your personal code review AI agent.
        </h2>
        <p>
          I&apos;m here to help you review your code. I&apos;ll give you a
          detailed analysis of the code, including security vulnerabilities,
          code style, and performance optimizations.
        </p>
        <ReviewClient
          files={data?.files || []}
          selectedFile={selectedFile}
          file={path}
        />
      </div>
    </div>
  );
}
