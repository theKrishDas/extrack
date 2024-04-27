import Link from "next/link";
import { settingsRoutes } from "./settingsRoutes";
import { IoChevronForwardSharp } from "react-icons/io5";

export default function SettingsList() {
  return (
    <div>
      <ul className="space-y-6">
        {settingsRoutes.map((route) => (
          <li key={route.groupName}>
            <h2 className="hidden">{route.groupName}</h2>
            <ul className="overflow-hidden rounded-3xl bg-card">
              {route.settings.map((setting) => (
                <li key={setting.title}>
                  <Link
                    href={setting.href}
                    className="relative flex items-center gap-3 p-5 text-lg capitalize"
                  >
                    <div className="sborder sborder-foreground/80 inline-grid h-10 w-10 place-content-center rounded-full bg-accent text-base">
                      {setting.icon}
                    </div>
                    {setting.title}
                    <IoChevronForwardSharp className="absolute right-5 top-1/2 -translate-y-1/2 justify-self-end" />
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
