import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="container flex h-[100dvh] flex-col items-center">
      <section className="flex w-full flex-1 items-center justify-center">
        <h1 className="text-xl font-bold tracking-tight">Extrack.</h1>
      </section>

      <div className="flex h-24 w-full items-center justify-center">
        <Button size="lg" className="h-14 w-full rounded-2xl text-base" asChild>
          <SignInButton />
        </Button>
      </div>
    </main>
  );
}
