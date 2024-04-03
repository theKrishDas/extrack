import Spinner from "@/components/spinner";

export default function FullscreenSpinner() {
  return (
    // TODO: Fix layout shifts because of this component and spacing of main element
    <div className="pointer-events-none absolute inset-0 left-0 top-0 z-[998] grid place-content-center bg-background">
      <Spinner />
    </div>
  );
}
