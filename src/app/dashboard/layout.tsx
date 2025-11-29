import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="text-xl font-bold">
            CreatorOps AI
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/content">
            <Button variant="ghost" className="w-full justify-start">
              Content
            </Button>
          </Link>
          <Link href="/dashboard/deals">
            <Button variant="ghost" className="w-full justify-start">
              Deals
            </Button>
          </Link>
          <Link href="/dashboard/followups">
            <Button variant="ghost" className="w-full justify-start">
              Follow-ups
            </Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button variant="ghost" className="w-full justify-start">
              Analytics
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start">
              Settings
            </Button>
          </Link>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div className="text-sm text-muted-foreground">
            Welcome back, {session.user?.name}
          </div>
          <form action="/api/auth/signout" method="POST">
            <Button variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}