import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="container flex h-[100dvh] flex-col items-center">
      <section className="flex w-full flex-1 flex-col items-center justify-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Extrack.</h1>
        <div className="w-fit rounded-full border border-foreground/10 px-4 py-1 text-xs text-foreground/50">
          <p>
            An Expense tracker by <span className="font-bold">pengeum.</span>
          </p>
        </div>
      </section>

      <div className="flex h-24 w-full items-center justify-center">
        <Button size="lg" className="h-14 w-full rounded-2xl text-base" asChild>
          <SignInButton />
        </Button>
      </div>

      <div className="absolute left-4 top-5 flex items-center gap-2 rounded-full bg-warning-foreground px-3 py-1">
        <div className="h-2 w-2 rounded-full bg-warning" />
        <p className="text-xs text-warning">Development preview</p>
      </div>
    </main>
  );
}
