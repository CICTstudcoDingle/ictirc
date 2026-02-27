"use client";

import Image from "next/image";
import { cn } from "@ictirc/ui";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex items-end gap-2 mb-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-maroon/10 border border-maroon/20 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/irjict-logo.png"
            alt="IRJICT"
            width={28}
            height={28}
            className="w-5 h-5 object-contain"
          />
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed overflow-hidden",
          isUser
            ? "bg-maroon text-white rounded-br-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <div className="text-sm [&>p]:mb-3 [&>p:last-child]:mb-0 [&_strong]:font-semibold [&_a]:text-maroon hover:[&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-1 [&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:rounded-md [&_code]:bg-gray-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded text-gray-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
          </div>
        )}
        {isStreaming && !isUser && (
          <span className="inline-flex gap-0.5 ml-1 align-middle mt-1">
            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
        )}
      </div>
    </div>
  );
}
