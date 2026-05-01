import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Scheduled maintenance",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getDeploymentStartedAt() {
  const deploymentId = process.env.VERCEL_DEPLOYMENT_ID ?? "local";
  const globalState = globalThis as typeof globalThis & {
    __xtrkDowntimeStartedAt?: Map<string, number>;
  };

  globalState.__xtrkDowntimeStartedAt ??= new Map();

  if (!globalState.__xtrkDowntimeStartedAt.has(deploymentId)) {
    globalState.__xtrkDowntimeStartedAt.set(deploymentId, Date.now());
  }

  return globalState.__xtrkDowntimeStartedAt.get(deploymentId) ?? Date.now();
}

function formatElapsedTime(startedAt: number) {
  const elapsedMs = Math.max(0, Date.now() - startedAt);
  const elapsedMinutes = Math.floor(elapsedMs / 60_000);

  if (elapsedMinutes < 1) {
    return "Less than a minute ago";
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} minute${elapsedMinutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(elapsedMinutes / 60);
  const minutes = elapsedMinutes % 60;

  if (hours < 24) {
    if (minutes === 0) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    return `${hours} hour${hours === 1 ? "" : "s"} ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return `${days} day${days === 1 ? "" : "s"} ${remainingHours} hour${remainingHours === 1 ? "" : "s"} ago`;
}

export default function MaintenancePage() {
  const startedAtLabel = formatElapsedTime(getDeploymentStartedAt());

  return (
    <main className="min-h-screen bg-background text-foreground relative font-sans">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top left, color-mix(in oklab, var(--foreground) 8%, transparent), transparent 32%)",
        }}
      />
      <div className="mx-auto relative flex min-h-screen w-full max-w-4xl items-center px-6 py-16 sm:px-10">
        <section className="w-full">
          <div className="space-y-10">
            <div className="space-y-4">
              <p
                className="text-sm font-medium uppercase tracking-[0.22em]"
                style={{
                  color:
                    "color-mix(in oklab, var(--foreground) 58%, transparent)",
                }}
              >
                Extrack status
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Scheduled maintenance
              </h1>
              <p
                className="max-w-xl text-base leading-7 sm:text-lg sm:leading-8"
                style={{
                  color:
                    "color-mix(in oklab, var(--foreground) 68%, transparent)",
                }}
              >
                We&apos;re updating our systems to serve you better. We&apos;ll
                be back shortly.
              </p>
            </div>

            <div
              className="grid gap-4 border-y py-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-x-8"
              style={{
                borderColor:
                  "color-mix(in oklab, var(--foreground) 10%, transparent)",
              }}
            >
              {[
                ["Status", "Maintenance in progress"],
                ["Expected duration", "30-45 minutes"],
                ["Started", startedAtLabel],
              ].map(([label, value]) => (
                <Fragment key={label + value}>
                  <div
                    key={`${label}-label`}
                    className="text-sm"
                    style={{
                      color:
                        "color-mix(in oklab, var(--foreground) 58%, transparent)",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    key={`${label}-value`}
                    className="text-sm font-medium sm:text-base"
                  >
                    {value}
                  </div>
                </Fragment>
              ))}
            </div>

            <div className="max-w-2xl space-y-3">
              <h2 className="text-base font-semibold sm:text-lg">
                What&apos;s happening
              </h2>
              <p
                className="text-sm leading-7 sm:text-base"
                style={{
                  color:
                    "color-mix(in oklab, var(--foreground) 68%, transparent)",
                }}
              >
                We&apos;re migrating our database infrastructure to improve
                performance and reliability. Your data is safe, and all accounts
                will be fully restored once maintenance completes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
