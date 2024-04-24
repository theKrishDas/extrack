import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBackSharp } from "react-icons/io5";

export default function PageTitleWithNavigation({
  heading,
  href,
  children,
}: {
  heading: string;
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="inline-flex w-full items-start justify-between gap-1 pb-5 pt-24">
      <Button
        size="icon"
        variant="secondary"
        className="shadow-nones fixed bottom-0 top-4 h-10 w-10 rounded-full text-lg"
        asChild
      >
        <Link href={href}>
          <IoArrowBackSharp />
        </Link>
      </Button>

      <div className="w-full flex-1 overflow-x-clip">
        <h1 className="text-nowrap text-5xl font-light tracking-tighter">
          {heading}
        </h1>
      </div>

      {children}
    </section>
  );
}
