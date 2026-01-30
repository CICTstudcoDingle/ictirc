import { NextResponse } from "next/server";
import { prisma } from "@ictirc/database/client";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, startDate, endDate, location, isPublished } = body;

    if (!title || !description || !startDate) {
      return NextResponse.json(
        { error: "Title, description, and start date are required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        imageUrl,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        isPublished: isPublished ?? false,
      },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
