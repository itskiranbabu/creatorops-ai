import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-2xl font-bold">CreatorOps AI</div>
          <nav className="flex gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            The AI Operating System
            <br />
            <span className="text-primary">that runs your creator business</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Automate content planning, repurposing, scheduling, and sponsorship
            management. Focus on creating while AI handles operations.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section id="features" className="border-t bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Everything you need to scale
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">Content Planning</h3>
                <p className="text-muted-foreground">
                  Plan, schedule, and track content across all platforms with an
                  intuitive calendar view.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">AI Repurposing</h3>
                <p className="text-muted-foreground">
                  Automatically generate platform-specific content variations,
                  hooks, and captions.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">Sponsorship CRM</h3>
                <p className="text-muted-foreground">
                  Track deals, manage sponsors, and automate follow-ups with AI
                  assistance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">Ready to get started?</h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Join creators who are scaling their operations with AI
            </p>
            <Link href="/auth/signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 CreatorOps AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}