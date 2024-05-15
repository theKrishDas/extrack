import { Main } from "@/components/mainwrapper";
import SettingsList from "./SettingsList";

export default function SettingsPage() {
  return (
    <Main>
      <h1 className="pt-12 text-5xl font-light tracking-tight">Settings</h1>
      <SettingsList />
    </Main>
  );
}
