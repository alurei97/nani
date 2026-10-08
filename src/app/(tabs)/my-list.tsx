import { AppText } from "@/components/app-text";
import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";

export default function Index() {
  return (
    <CustomScreen>
      <CenteredContent>
        <AppText className="text-status-completed text-5xl">MY LIST</AppText>
      </CenteredContent>
    </CustomScreen>
  );
}
