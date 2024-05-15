import { Main } from "@/components/mainwrapper";
import SettingsList from "./SettingsList";
import { ContentWrapper } from "@/components/contentwrapper";

export default function SettingsPage() {
  return (
    <Main>
      <h1 className="pb-8 pt-12 text-5xl font-light tracking-tight">
        Settings
      </h1>

      <ContentWrapper>
        <SettingsList />
      </ContentWrapper>
    </Main>
  );
}
