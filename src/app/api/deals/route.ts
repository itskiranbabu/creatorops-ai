import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
    });

    if (!workspaceMember) {
      return NextResponse.json({ message: 'No workspace found' }, { status: 404 });
    }

    const deals = await prisma.deal.findMany({
      where: {
        workspaceId: workspaceMember.workspaceId,
      },
      include: {
        sponsor: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        followups: {
          where: { completedAt: null },
          orderBy: { dueAt: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ deals });
  } catch (error) {
    console.error('Deals fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sponsorId, name, value, currency, expectedCloseDate, notes } = body;

    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
    });

    if (!workspaceMember) {
      return NextResponse.json({ message: 'No workspace found' }, { status: 404 });
    }

    const deal = await prisma.deal.create({
      data: {
        workspaceId: workspaceMember.workspaceId,
        sponsorId,
        name,
        value: value ? parseFloat(value) : null,
        currency: currency || 'USD',
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        notes,
        status: 'LEAD',
      },
      include: {
        sponsor: true,
      },
    });

    // Create initial activity
    await prisma.dealActivity.create({
      data: {
        dealId: deal.id,
        type: 'NOTE',
        content: 'Deal created',
        createdBy: session.user.id,
      },
    });

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error('Deal creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}