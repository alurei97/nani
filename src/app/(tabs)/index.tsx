import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import { AppText as Text } from "@/components/app-text";
import { Link } from "expo-router";

export default function Index() {
  return (
    <CustomScreen>
      <CenteredContent>
        <Text className="text-accent text-5xl">DISCOVER SCREEN</Text>

        <Link href={"./my-list/"} className="font-nunito text-blue-300 text-3xl">
          Go to My list
        </Link>
      </CenteredContent>
    </CustomScreen>
  );
}
