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

    const sponsors = await prisma.sponsor.findMany({
      where: {
        workspaceId: workspaceMember.workspaceId,
      },
      include: {
        deals: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ sponsors });
  } catch (error) {
    console.error('Sponsors fetch error:', error);
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
    const { name, email, website, notes } = body;

    if (!name) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
    });

    if (!workspaceMember) {
      return NextResponse.json({ message: 'No workspace found' }, { status: 404 });
    }

    const sponsor = await prisma.sponsor.create({
      data: {
        workspaceId: workspaceMember.workspaceId,
        name,
        email,
        website,
        notes,
      },
    });

    return NextResponse.json({ sponsor }, { status: 201 });
  } catch (error) {
    console.error('Sponsor creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}