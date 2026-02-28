import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// ─── Rate Limiter (in-memory, per browser session) ────────────────────────────

const RATE_LIMIT = 5;          // max requests
const WINDOW_MS = 60 * 1000;  // per 60 seconds

const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(sessionId);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // New session or window expired — reset
    rateLimitMap.set(sessionId, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count += 1;
  return false;
}

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the official AI assistant for IRJICT (International Research Journal on Information and Communications Technology), a scholarly publication platform managed by the College of Information and Computing Technology (CICT) at Iloilo State University of Fisheries and Technology (ISUFST), Dingle Campus, Iloilo, Philippines.

YOUR KNOWLEDGE BASE:
- Journal Full Name: International Research Journal on Information and Communications Technology (IRJICT)
- ISSN: 2960-3773
- Contact Email: cict_dingle@isufst.edu.ph
- Submission Email: cict_dingle@isufst.edu.ph
- Phone: +63-33-5801815
- Institution: ISUFST – College of Information and Computing Technology (CICT), Dingle Campus
- Website: https://irjict.isufstcict.com/

SUBMISSION PROCESS (Step-by-Step):
1. Submit your article via the website or email to cict_dingle@isufst.edu.ph
2. Manuscript/paper checking process (Technical check, Plagiarism detection, Content review, AI Detection)
3. Manuscript/paper ID is assigned to the author
4. Editorial review — outcomes: Accepted / Minor Changes / Major Changes / Rejected
5. The final decision of acceptance is sent to the authors
6. Authors submit Copyright Transfer and Agreement Form to cict_dingle@isufst.edu.ph
7. Final article (PDF/HTML) is prepared and published on the IRJICT website

KEY POLICIES:
- Review process: Double-blind peer review (author names removed for unbiased review)
- Review duration: Maximum of 15–20 working days
- Publication frequency: Twice per year (two issues annually)
- Multiple submissions per issue: Allowed — you may submit more than one paper per issue
- Open access: Yes — all published articles are freely accessible
- License: Creative Commons Attribution-NoDerivs (CC BY-ND)
- Plagiarism thresholds: Under 15% auto-passes; 15–25% is flagged for editor review; above 25% is auto-rejected (overrideable by the Dean)
- Copyright Transfer Form: Download from the website and submit to cict_dingle@isufst.edu.ph
- Paper template: Available for download on the Guides page of the website
- DOI: IRJICT is working towards DOI registration. Official DOI assignment is not yet established. Check the website for the latest updates.
- Acceptance letter: Issued after the completion of the review process

ABOUT THE WEBSITE (irjict.isufstcict.com):
- Browse Archive: View all published research papers by year/issue
- Submit: Online manuscript submission form
- Guides: Downloadable templates and formatting guidelines
- FAQ: Common questions about submission and publication
- Track: Authors can track their manuscript status using their paper ID
- Search: Full-text search across all published papers (powered by Algolia)
- Conferences: Information about upcoming ICT research conferences hosted by CICT
- Contact: Use the contact form or email cict_dingle@isufst.edu.ph

STRICT RULES YOU MUST FOLLOW:
1. ONLY answer questions about IRJICT, its submission/publication process, website features, or general scholarly publishing concepts.
2. If a question is outside your knowledge base or you are not 100% certain of the answer, respond EXACTLY with: "I'm not sure about that. For accurate and up-to-date information, please contact us directly at cict_dingle@isufst.edu.ph or use the Contact form on our website."
3. NEVER fabricate, guess, or assume any facts, names, dates, fees, deadlines, or policies not explicitly listed above.
4. Be concise, professional, and helpful. Use plain and clear language.
5. If asked who you are: "I'm the IRJICT AI Assistant, here to help with questions about our journal and the submission process."
6. Do not answer questions about other journals, universities, or unrelated topics.`;

// ─── Gemini Client ────────────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, sessionId }: { messages: ChatMessage[]; sessionId: string } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Rate limit check
    if (isRateLimited(sessionId)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment before sending again." },
        { status: 429 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build chat history (all messages except the last one, which is the new user message)
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });

    // Use streaming
    const result = await chat.sendMessageStream(lastMessage.content);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[/api/chat] Error:", error);
    return NextResponse.json(
      { error: "An internal error occurred. Please try again." },
      { status: 500 }
    );
  }
}
