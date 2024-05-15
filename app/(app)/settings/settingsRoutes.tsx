import { IoBag, IoFunnel } from "react-icons/io5";

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
    groupName: "transaction",
    settings: [
      {
        title: "starting balance",
        href: "/settings/starting-balance",
        icon: <IoBag />,
      },
      {
        title: "category",
        href: "/settings/category",
        icon: <IoFunnel />,
      },
    ],
  },
];
