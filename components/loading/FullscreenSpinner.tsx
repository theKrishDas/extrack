import Spinner from "@/components/spinner";

export default function FullscreenSpinner() {
  return (
    // NOTE: --- bottom navigation has z-index: 9 ---
    // TODO: Fix layout shifts because of this component and spacing of main element
    <div className="pointer-events-none absolute inset-0 left-0 top-0 isolate z-[8] grid place-content-center bg-background">
      <Spinner />
    </div>
  );
}
