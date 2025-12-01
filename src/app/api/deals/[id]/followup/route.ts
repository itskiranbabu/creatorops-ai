import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { aiService } from '@/lib/ai-service';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { dueAt } = await req.json();

    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: {
        sponsor: true,
        workspace: { include: { subscription: true } },
      },
    });

    if (!deal) {
      return NextResponse.json({ message: 'Deal not found' }, { status: 404 });
    }

    // Check AI quota
    const subscription = deal.workspace.subscription;
    if (
      subscription &&
      subscription.aiCallsUsed >= subscription.aiCallsLimit
    ) {
      return NextResponse.json(
        { message: 'AI quota exceeded. Please upgrade your plan.' },
        { status: 429 }
      );
    }

    // Generate follow-up email
    const result = await aiService.generateFollowupEmail(
      {
        dealName: deal.name,
        sponsorName: deal.sponsor.name,
        status: deal.status,
        notes: deal.notes || undefined,
      },
      session.user.id,
      deal.workspaceId
    );

    if (!result.success) {
      return NextResponse.json(
        { message: result.error || 'AI generation failed' },
        { status: 500 }
      );
    }

    // Create follow-up record
    const followup = await prisma.followup.create({
      data: {
        dealId: deal.id,
        dueAt: new Date(dueAt),
        generatedText: result.data,
      },
    });

    // Create activity
    await prisma.dealActivity.create({
      data: {
        dealId: deal.id,
        type: 'FOLLOWUP',
        content: `Follow-up scheduled for ${new Date(dueAt).toLocaleDateString()}`,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json({ followup });
  } catch (error) {
    console.error('Follow-up generation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}