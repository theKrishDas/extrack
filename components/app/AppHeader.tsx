import { UserButton } from "@clerk/nextjs";

export default function AppHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1>
        Welcome to <span className="font-mono font-semibold">PJO-24</span>
      </h1>

      <UserButton />
    </div>
  );
}
