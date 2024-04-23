import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import BottomNavLink from "./BottonNavLink";
import NewTransactionDrawer from "@/app/test/NewTransactionDrawer";

export default function BottomNavigation() {
  return (
    // NOTE: --- bottom navigation has z-index: 9 ---
    <footer className="fixed bottom-0 left-0 isolate z-[9] w-full border-t bg-background/80 backdrop-blur-md">
      <nav className="container flex items-center justify-around py-2">
        <BottomNavLink
          prop={{
            name: "Home",
            href: "/",
            activeIcon: <GoHomeFill />,
            inActiveIcon: <GoHome />,
          }}
        />

        <NewTransactionDrawer />

        <BottomNavLink
          prop={{
            name: "Settings",
            href: "/settings",
            activeIcon: <IoSettingsSharp />,
            inActiveIcon: <IoSettingsOutline />,
          }}
        />
      </nav>
    </footer>
  );
}
