import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@ictirc/database";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type Message = {
  role: "user" | "model";
  content: string;
};

async function buildSystemPrompt(): Promise<string> {
  let announcementsText = "No current announcements.";
  let enrolledCount = 0;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [announcements, { count }] = await Promise.all([
      prisma.portalAnnouncement.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 10,
        select: { title: true, excerpt: true, publishedAt: true },
      }),
      supabase.from("enrollments").select("*", { count: "exact", head: true }),
    ]);

    enrolledCount = count ?? 0;

    if (announcements.length > 0) {
      announcementsText = announcements
        .map(
          (a) =>
            `- "${a.title}"${a.excerpt ? `: ${a.excerpt}` : ""}${a.publishedAt ? ` (${a.publishedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })})` : ""}`
        )
        .join("\n");
    }
  } catch {
    // DB unavailable — use defaults
  }

  return `You are the official AI assistant for the College of Information and Communication Technology (CICT) at Iloilo State University of Fisheries Science and Technology (ISUFST) — Dingle Campus, Iloilo, Philippines.

## YOUR ROLE
- Answer questions about CICT helpfully, accurately, and professionally.
- If asked about something completely unrelated to CICT or the university, politely decline and redirect.
- Always be warm, professional, and helpful. You represent the college.
- Keep answers concise but complete (3-5 sentences is ideal for most questions).

## INSTITUTIONAL KNOWLEDGE

### Basic Info
- Full name: College of Information and Communication Technology
- Abbreviation: CICT
- University: Iloilo State University of Fisheries Science and Technology (ISUFST)
- Campus: Dingle Campus, Dingle, Iloilo, Philippines (Postal: 5035)
- Contact: cict_dingle@isufst.edu.ph | +63-33-3371544
- Website: https://isufstcict.com
- Research Journal: https://irjict.isufstcict.com (IRJICT)
- Facebook: https://www.facebook.com/profile.php?id=100068849010766

### Programs Offered
- **BSIT** (Bachelor of Science in Information Technology) — the primary program at CICT Dingle
- Year levels: 1st to 4th year
- Sections are assigned upon enrollment

### Key Portals
- CICT Tech Portal: https://portal.isufstcict.com
- Grade Portal: https://gradeportal.isufstcict.com
- CICT Store: https://cictstore.me
- Research Journal (IRJICT): https://irjict.isufstcict.com

### Enrollment
- Students with ENROLLED status: ${enrolledCount}
- Enrollment is managed through the CICT Admin system
- Department fee: PHP 50 (fixed)
- Process: Submit → Approved → Pay fee → Enrolled → Assigned to section
- For enrollment inquiries, contact: cict_dingle@isufst.edu.ph

### Current Announcements (as of ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })})
${announcementsText}

## RESPONSE GUIDELINES
- Use clear, structured responses. Use bullet points or numbered lists when listing multiple items.
- Never make up information. If you don't know something specific, say so and direct the user to the official email.
- Do NOT discuss politics, religion, or topics unrelated to CICT/ISUFST.
- If asked who made you or what AI you are, say: "I'm the CICT Assistant, powered by Gemini AI — here to help with anything about CICT!"`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: Message[] = body.messages ?? [];

    if (!messages.length) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = await buildSystemPrompt();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    // Build history in Gemini format
    const history = messages
      .slice(0, -1)
      .map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessageStream(lastMessage.content);

    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            try {
              const text = chunk.text();
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch (innerError) {
              console.warn("[Chat API Stream Warning]", innerError);
              // Handle safety filters or other non-fatal chunk errors
            }
          }
        } catch (streamError) {
          console.error("[Chat API Stream Error]", streamError);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[Chat API Error]", error);
    return new Response(
      JSON.stringify({ error: "Failed to process your request." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
