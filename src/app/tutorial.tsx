import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import { Text } from "react-native";

export default function Tutorial() {
  return (
    <CustomScreen style={{ backgroundColor: "#aaaaaa" }}>
      <CenteredContent>
        <Text className="text-accent text-5xl">Tutorial placeholder</Text>
      </CenteredContent>
    </CustomScreen>
  );
}
