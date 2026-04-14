"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, X, Send, Sparkles, Minus, RotateCcw } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  streaming?: boolean;
};

const STARTER_QUESTIONS = [
  "What programs does CICT offer?",
  "How do I enroll in CICT?",
  "What are the latest announcements?",
  "What are the CICT portals?",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-maroon/10 border border-maroon/20 flex items-center justify-center shrink-0 mr-2 mt-0.5">
          <Bot className="w-3.5 h-3.5 text-maroon" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-maroon text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm"
        } ${message.streaming ? "border-r-2 border-maroon/60" : ""}`}
      >
        {message.content || (message.streaming ? <TypingDots /> : "")}
      </div>
    </div>
  );
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    const assistantId = `model-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "model", content: "", streaming: true },
    ]);

    try {
      abortRef.current = new AbortController();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok || !response.body) throw new Error("API error");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: accumulated, streaming: true }
              : m
          )
        );
      }

      // Finalize
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: accumulated, streaming: false }
            : m
        )
      );
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: "Sorry, I couldn't process your request. Please try again.",
                streaming: false,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function clearChat() {
    if (isStreaming) abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-[380px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-maroon">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white/15 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">CICT Assistant</p>
                <p className="text-[10px] text-white/60 leading-tight">Powered by Gemini</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize"
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 min-h-[300px] max-h-[420px] scroll-smooth">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-2">
                <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-maroon" />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Hi! I&apos;m the CICT Assistant
                </p>
                <p className="text-xs text-gray-400 mb-5">
                  Ask me anything about CICT programs, enrollment, or announcements.
                </p>
                <div className="grid grid-cols-1 gap-2 w-full">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left text-xs px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:border-maroon/30 hover:bg-maroon/5 hover:text-maroon transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 px-3 py-3">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-1.5 focus-within:border-maroon/40 focus-within:ring-1 focus-within:ring-maroon/20 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about CICT..."
                disabled={isStreaming}
                className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400 disabled:opacity-60"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isStreaming}
                className="w-7 h-7 bg-maroon rounded-lg flex items-center justify-center text-white hover:bg-maroon/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-center text-[9px] text-gray-300 mt-1.5">
              Powered by Gemini · CICT ISUFST
            </p>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`fixed bottom-20 right-4 sm:right-6 z-50 w-13 h-13 w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center
          ${isOpen ? "bg-gray-700 rotate-90" : "bg-maroon hover:bg-maroon/90 hover:shadow-[0_0_0_4px_rgba(212,175,55,0.3)]"}
        `}
        aria-label={isOpen ? "Close chat" : "Open CICT Assistant"}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </button>
    </>
  );
}
