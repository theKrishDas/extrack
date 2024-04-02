import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div>
      <p>This should be accessed by everyone</p>
      <Button size="lg" variant="default" asChild>
        <SignInButton />
      </Button>
    </div>
  );
}
