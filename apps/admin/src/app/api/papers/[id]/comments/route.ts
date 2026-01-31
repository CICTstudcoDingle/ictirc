import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@ictirc/database';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // TODO: Get actual user from session
    // For now, we'll create/use a system admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@ictirc.com' },
      update: {},
      create: {
        id: 'admin-system',
        email: 'admin@ictirc.com',
        name: 'System Admin',
        role: 'EDITOR',
      },
    });

    const comment = await prisma.paperComment.create({
      data: {
        content,
        paperId: id,
        authorId: adminUser.id,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const comments = await prisma.paperComment.findMany({
      where: { paperId: id },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
