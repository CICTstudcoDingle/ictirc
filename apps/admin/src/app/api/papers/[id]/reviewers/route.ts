import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@ictirc/database';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { reviewerId } = body;

    if (!reviewerId) {
      return NextResponse.json({ error: 'Reviewer ID is required' }, { status: 400 });
    }

    // Check if reviewer exists and has appropriate role
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId },
    });

    if (!reviewer || (reviewer.role !== 'REVIEWER' && reviewer.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Invalid reviewer' }, { status: 400 });
    }

    // Check if already assigned
    const existing = await prisma.paperReviewer.findUnique({
      where: {
        paperId_reviewerId: {
          paperId: id,
          reviewerId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Reviewer already assigned' }, { status: 400 });
    }

    const assignment = await prisma.paperReviewer.create({
      data: {
        paperId: id,
        reviewerId,
      },
      include: {
        reviewer: true,
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error assigning reviewer:', error);
    return NextResponse.json({ error: 'Failed to assign reviewer' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const body = await request.json();
    const { assignmentId } = body;

    if (!assignmentId) {
      return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
    }

    await prisma.paperReviewer.delete({
      where: { id: assignmentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing reviewer:', error);
    return NextResponse.json({ error: 'Failed to remove reviewer' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const reviewers = await prisma.paperReviewer.findMany({
      where: { paperId: id },
      include: {
        reviewer: true,
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });

    return NextResponse.json(reviewers);
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    return NextResponse.json({ error: 'Failed to fetch reviewers' }, { status: 500 });
  }
}
