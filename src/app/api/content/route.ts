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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
    });

    if (!workspaceMember) {
      return NextResponse.json({ message: 'No workspace found' }, { status: 404 });
    }

    const contentItems = await prisma.contentItem.findMany({
      where: {
        workspaceId: workspaceMember.workspaceId,
        ...(status && { status: status as any }),
      },
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ contentItems });
  } catch (error) {
    console.error('Content fetch error:', error);
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
    const { title, description, type, platforms, scheduledAt, dueDate } = body;

    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
    });

    if (!workspaceMember) {
      return NextResponse.json({ message: 'No workspace found' }, { status: 404 });
    }

    const contentItem = await prisma.contentItem.create({
      data: {
        workspaceId: workspaceMember.workspaceId,
        title,
        description,
        type,
        platforms,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'IDEA',
      },
    });

    return NextResponse.json({ contentItem }, { status: 201 });
  } catch (error) {
    console.error('Content creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}