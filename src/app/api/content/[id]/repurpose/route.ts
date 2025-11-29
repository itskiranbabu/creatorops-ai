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

    const contentItem = await prisma.contentItem.findUnique({
      where: { id: params.id },
      include: { workspace: { include: { subscription: true } } },
    });

    if (!contentItem) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    // Check AI quota
    const subscription = contentItem.workspace.subscription;
    if (
      subscription &&
      subscription.aiCallsUsed >= subscription.aiCallsLimit
    ) {
      return NextResponse.json(
        { message: 'AI quota exceeded. Please upgrade your plan.' },
        { status: 429 }
      );
    }

    // Generate repurposed content
    const result = await aiService.generateRepurposedContent(
      contentItem.description || contentItem.title,
      contentItem.platforms,
      session.user.id,
      contentItem.workspaceId
    );

    if (!result.success) {
      return NextResponse.json(
        { message: result.error || 'AI generation failed' },
        { status: 500 }
      );
    }

    // Save variants
    const variants = [];
    const data = result.data;

    // Save hooks
    if (data.hooks) {
      for (const hook of data.hooks) {
        const variant = await prisma.contentVariant.create({
          data: {
            contentItemId: contentItem.id,
            platform: contentItem.platforms[0],
            variantType: 'HOOK',
            text: hook,
          },
        });
        variants.push(variant);
      }
    }

    // Save captions
    if (data.captions) {
      for (const [platform, caption] of Object.entries(data.captions)) {
        if (contentItem.platforms.includes(platform as any)) {
          const variant = await prisma.contentVariant.create({
            data: {
              contentItemId: contentItem.id,
              platform: platform as any,
              variantType: 'CAPTION',
              text: caption as string,
            },
          });
          variants.push(variant);
        }
      }
    }

    // Save hashtags
    if (data.hashtags) {
      const variant = await prisma.contentVariant.create({
        data: {
          contentItemId: contentItem.id,
          platform: contentItem.platforms[0],
          variantType: 'HASHTAGS',
          text: data.hashtags.join(' '),
        },
      });
      variants.push(variant);
    }

    return NextResponse.json({ variants });
  } catch (error) {
    console.error('Repurpose error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}