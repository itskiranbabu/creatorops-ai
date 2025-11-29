import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function getDashboardData(userId: string) {
  const workspaceMember = await prisma.workspaceMember.findFirst({
    where: { userId },
    include: {
      workspace: {
        include: {
          contentItems: {
            where: {
              status: { in: ['SCHEDULED', 'PUBLISHED'] },
            },
          },
          deals: {
            where: {
              status: { notIn: ['WON', 'LOST'] },
            },
          },
          subscription: true,
        },
      },
    },
  });

  if (!workspaceMember) {
    return null;
  }

  const scheduledCount = workspaceMember.workspace.contentItems.filter(
    (item) => item.status === 'SCHEDULED'
  ).length;

  const publishedCount = workspaceMember.workspace.contentItems.filter(
    (item) => item.status === 'PUBLISHED'
  ).length;

  const activeDealsCount = workspaceMember.workspace.deals.length;

  const upcomingFollowups = await prisma.followup.count({
    where: {
      deal: {
        workspaceId: workspaceMember.workspaceId,
      },
      completedAt: null,
      dueAt: {
        gte: new Date(),
        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return {
    workspace: workspaceMember.workspace,
    stats: {
      scheduledCount,
      publishedCount,
      activeDealsCount,
      upcomingFollowups,
    },
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const data = await getDashboardData(session!.user!.id);

  if (!data) {
    return <div>No workspace found</div>;
  }

  const { workspace, stats } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to {workspace.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Scheduled Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduledCount}</div>
            <p className="text-xs text-muted-foreground">
              Ready to publish
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedCount}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDealsCount}</div>
            <p className="text-xs text-muted-foreground">
              In pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingFollowups}</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>
            What you should focus on today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div>
                <p className="font-medium">Schedule more content for this week</p>
                <p className="text-sm text-muted-foreground">
                  You have {stats.scheduledCount} posts scheduled. Consider adding 2-3 more for consistent publishing.
                </p>
              </div>
            </div>

            {stats.activeDealsCount > 0 && (
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <div>
                  <p className="font-medium">Follow up on active deals</p>
                  <p className="text-sm text-muted-foreground">
                    You have {stats.activeDealsCount} active sponsorship deals. Check if any need follow-up.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div>
                <p className="font-medium">Repurpose your recent content</p>
                <p className="text-sm text-muted-foreground">
                  Use AI to create platform-specific variations of your best-performing content.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>
            Your current plan and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Plan:</span>
              <span className="text-sm">{workspace.subscription?.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">AI Calls Used:</span>
              <span className="text-sm">
                {workspace.subscription?.aiCallsUsed} / {workspace.subscription?.aiCallsLimit}
              </span>
            </div>
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{
                    width: `${
                      ((workspace.subscription?.aiCallsUsed || 0) /
                        (workspace.subscription?.aiCallsLimit || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}