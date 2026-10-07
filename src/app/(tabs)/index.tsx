import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import { Link } from "expo-router";
import { Text } from "react-native";

export default function Index() {
  return (
    <CustomScreen>
      <CenteredContent>
        <Text className="text-accent text-5xl">DISCOVER SCREEN</Text>

        <Link href={"./my_list/"} className="text-blue-300 text-3xl">
          Go to My list
        </Link>
      </CenteredContent>
    </CustomScreen>
  );
}
