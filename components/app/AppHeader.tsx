import { UserButton } from "@clerk/nextjs";

export default function AppHeader() {
  return (
    <div className="flex h-[32px] items-center justify-between overflow-hidden">
      <h1>
        Welcome to <span className="font-mono font-semibold">PJO-24</span>
      </h1>

      {/* NOTE: Remove the hard-coded height from the parent if when removing this component */}
      <UserButton />
    </div>
  );
}
