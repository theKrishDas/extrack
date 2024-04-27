import { IoBag, IoContrastSharp, IoFunnel } from "react-icons/io5";

export type TSettingsRoutes = {
  icon: React.ReactNode;
  title: string;
  href: string;
};

type SettingsRouteGroup = {
  groupName: string;
  settings: TSettingsRoutes[];
};

export const settingsRoutes: SettingsRouteGroup[] = [
  {
    groupName: "ui",
    settings: [
      {
        title: "theme",
        href: "/settings",
        icon: <IoContrastSharp />,
      },
    ],
  },
  {
    groupName: "transaction",
    settings: [
      {
        title: "starting balance",
        href: "/settings",
        icon: <IoBag />,
      },
      {
        title: "category",
        href: "/settings",
        icon: <IoFunnel />,
      },
    ],
  },
];
