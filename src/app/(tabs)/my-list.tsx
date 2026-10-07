import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import { Text } from "react-native";

export default function Index() {
  return (
    <CustomScreen>
      <CenteredContent>
        <Text className="text-status-completed text-5xl">MY LIST</Text>
      </CenteredContent>
    </CustomScreen>
  );
}
