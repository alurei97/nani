import { AppText as Text } from "@/components/app-text";
import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import { useSwipeStore } from "@/store/swipe-store";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

function TutorialBtn() {
  const router = useRouter();

  return (
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
  );
}

function FilterScreen() {
  return (
    <View>
      <Text className="text-accent text-5xl">FILTERING SCREEN</Text>
      <Pressable
        onPress={() => useSwipeStore.setState({ swipeState: "swipe" })}
      >
        <Text className="text-accent text-2xl">shuffle</Text>
      </Pressable>
    </View>
  );
}

function SwipeScreen() {
  return (
    <View>
      <Pressable
        onPress={() => useSwipeStore.setState({ swipeState: "filter" })}
      >
        <Text className="text-accent text-2xl">Edit filters</Text>
      </Pressable>
      <Text className="text-accent text-5xl">SWIPING SCREEN</Text>
    </View>
  );
}

export default function Index() {
  const swipeState = useSwipeStore((state) => state.swipeState);

  return (
    <CustomScreen>
      <CenteredContent>
        <TutorialBtn />

        {swipeState === "filter" ? <FilterScreen /> : <SwipeScreen />}

        {/* <Link
          href={"./my-list/"}
          className="font-nunito text-blue-300 text-3xl"
        >
          Go to My list
        </Link> */}
      </CenteredContent>
    </CustomScreen>
  );
}
