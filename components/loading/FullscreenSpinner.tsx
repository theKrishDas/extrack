import Spinner from "@/components/spinner";

export default function FullscreenSpinner() {
  return (
    <div className="pointer-events-none absolute inset-0 left-0 top-0 z-[998] grid place-content-center bg-secondary">
      <Spinner />
    </div>
  );
}
