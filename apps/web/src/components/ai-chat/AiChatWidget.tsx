"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Minus, Send, AlertCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@ictirc/ui";
import { ChatMessage } from "./chat-message";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ─── Session ID Helper ────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "irjict_chat_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef<string>("");

  // Initialise session ID once on mount
  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && hasAccepted) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, hasAccepted]);

  const sendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    // Placeholder streaming message
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const allMessages = [
        ...messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user" as const, content: m.content })),
        { role: "user" as const, content: text },
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages,
          sessionId: sessionIdRef.current,
        }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError(data.error || "Too many messages. Please wait a moment.");
        return;
      }

      if (!res.ok || !res.body) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError("Something went wrong. Please try again.");
        return;
      }

      // Stream the response
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 flex flex-col",
            "bottom-24 left-4 md:bottom-6 md:left-auto md:right-6",
            "w-[calc(100vw-2rem)] max-w-sm",
            "bg-white rounded-2xl shadow-2xl border border-gray-200",
            "overflow-hidden",
            "animate-in slide-in-from-bottom-4 fade-in duration-200"
          )}
          style={{ height: "min(520px, calc(100dvh - 8rem))" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-maroon/10 flex items-center justify-center">
                <Image
                  src="/images/irjict-logo.png"
                  alt="IRJICT"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-none">IRJICT Assistant</p>
                <p className="text-xs text-emerald-500 mt-0.5">● Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Minimize chat"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setIsOpen(false); setHasAccepted(false); }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Disclaimer Screen */}
          {!hasAccepted ? (
            <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-maroon/5 border border-maroon/10 flex items-center justify-center">
                <Image
                  src="/images/irjict-logo.png"
                  alt="IRJICT"
                  width={40}
                  height={40}
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">IRJICT AI Assistant</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  This assistant is powered by{" "}
                  <span className="font-medium text-gray-700">Google Gemini AI</span>.
                  Responses may not always be accurate — contact us directly when in doubt.
                </p>
              </div>
              <button
                onClick={() => setHasAccepted(true)}
                className="w-full py-2.5 px-4 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon/90 transition-colors hover:shadow-[4px_4px_0px_0px_rgba(212,175,55,0.6)]"
              >
                Start Conversation
              </button>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50/50">
                {messages.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-xs text-gray-400 mb-3">Ask me anything about IRJICT</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "How do I submit a paper?",
                        "What is the review process?",
                        "What is IRJICT's ISSN?",
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => { setInputValue(suggestion); inputRef.current?.focus(); }}
                          className="text-xs bg-white border border-gray-200 text-gray-600 rounded-full px-3 py-1.5 hover:border-maroon/30 hover:text-maroon transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    isStreaming={isLoading && i === messages.length - 1 && msg.role === "assistant" && msg.content === ""}
                  />
                ))}

                {/* Error Toast */}
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2 mt-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex-shrink-0 border-t border-gray-100 bg-white px-3 py-3">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-maroon/50 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question…"
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50"
                    maxLength={500}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-maroon text-white disabled:opacity-40 hover:bg-maroon/90 transition-colors flex-shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom Disclaimer */}
                <p className="mt-2 text-center text-[10px] text-gray-400 leading-tight">
                  ⚡ Powered by Gemini AI · Verify important info with{" "}
                  <a href="mailto:cict_dingle@isufst.edu.ph" className="underline hover:text-maroon">
                    cict_dingle@isufst.edu.ph
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Bubble Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "fixed z-50 flex items-center justify-center",
          "bottom-[5.5rem] left-4 md:bottom-6 md:left-auto md:right-6",
          "w-14 h-14 rounded-full shadow-lg",
          "bg-maroon text-white",
          "hover:shadow-[0_0_0_4px_rgba(212,175,55,0.35)]",
          "transition-all duration-200 active:scale-95",
          isOpen && "ring-2 ring-gold ring-offset-2"
        )}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </>
  );
}
