import { Button } from "../ui/button";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";

export default function InlineNavigation({
  heading,
  href,
  linkText,
}: {
  heading: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-bold leading-tight">{heading}</h4>

      <Button size="sm" variant="ghost" asChild>
        <Link href={href}>
          {linkText}
          <IoChevronForward />
        </Link>
      </Button>
    </div>
  );
}
