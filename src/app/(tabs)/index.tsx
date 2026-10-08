import { AppText as Text } from "@/components/app-text";
import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import { Link, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <CustomScreen>
      <CenteredContent>
        <Pressable
          onPress={() => router.push("/tutorial")}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 44,
            height: 44,
            backgroundColor: "transparent",
          }}
        />

        <Text className="text-accent text-5xl">DISCOVER SCREEN</Text>

        <Link
          href={"./my-list/"}
          className="font-nunito text-blue-300 text-3xl"
        >
          Go to My list
        </Link>
      </CenteredContent>
    </CustomScreen>
  );
}
