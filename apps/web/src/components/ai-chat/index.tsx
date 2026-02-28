import { Suspense, lazy } from "react";

// Lazy-loaded AI Chat widget — only loads when React is idle.
// This prevents ~13KB of streaming/chat JS from blocking page interactions.
const AiChatWidgetLazy = lazy(() =>
  import("./AiChatWidget").then((mod) => ({ default: mod.AiChatWidget }))
);

/**
 * Deferred wrapper that renders nothing on the server and lazy-loads
 * the AI Chat widget on the client side. A minimal floating button
 * skeleton could be added here if needed.
 */
export function AiChatWidget() {
  return (
    <Suspense fallback= { null} >
    <AiChatWidgetLazy />
    </Suspense>
  );
}
