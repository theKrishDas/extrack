import type { BottomNavContentType } from "@/lib/types/bottom-nav-content";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { TbSquareRoundedPlus, TbSquareRoundedPlusFilled } from "react-icons/tb";
import BottomNavLink from "./BottonNavLink";
import NewTransactionDrawer from "@/app/test/NewTransactionDrawer";

const navContent: BottomNavContentType[] = [
  {
    name: "Home",
    href: "/",
    activeIcon: <GoHomeFill />,
    inActiveIcon: <GoHome />,
  },
  {
    name: "",
    href: "/new",
    activeIcon: <TbSquareRoundedPlusFilled className="text-4xl" />,
    inActiveIcon: (
      <TbSquareRoundedPlus className="text-4xl" strokeWidth={1.3} />
    ),
  },
  {
    name: "Settings",
    href: "/settings",
    activeIcon: <IoSettingsSharp />,
    inActiveIcon: <IoSettingsOutline />,
  },
];

export default function BottomNavigation() {
  return (
    // NOTE: --- bottom navigation has z-index: 9 ---
    <footer className="fixed bottom-0 left-0 isolate z-[9] w-full border-t bg-background/80 backdrop-blur-md">
      <nav className="container flex items-center justify-around py-2">
        {navContent.map((content) => (
          <BottomNavLink key={content.href} prop={content} />
        ))}
        <NewTransactionDrawer />
      </nav>
    </footer>
  );
}
