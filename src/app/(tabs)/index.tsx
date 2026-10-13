import { AppText, AppText as Text } from "@/components/app-text";
import CustomScreen from "@/components/custom-screen";
import colors from "@/constants/colors.json";
import { useFilterStore } from "@/store/filter-store";
import { useSwipeStore } from "@/store/swipe-store";
import FontAwesome from "@react-native-vector-icons/fontawesome";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

function FilterScreen() {
  function Appbar() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 16,
        }}
      >
        <AppText className="text-white text-3xl" weight="bold">
          What's your mood?
        </AppText>

        <Pressable onPress={() => useFilterStore.getState().resetAll()}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <FontAwesome name="rotate-right" color={colors.body} size={16} />
            <AppText style={{ color: colors.body }} className="text-xl">
              Reset
            </AppText>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar />

      <View style={{ gap: 10 }}>
        <Text className="text-accent text-5xl">FILTERING SCREEN</Text>
        <Pressable
          onPress={() => useSwipeStore.setState({ swipeState: "swipe" })}
        >
          <Text className="text-accent text-2xl">shuffle</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SwipeScreen() {
  const router = useRouter();

  function Appbar() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 16,
        }}
      >
        <Pressable onLongPress={() => router.push("/tutorial")}>
          <AppText className="text-white text-3xl" weight="bold">
            Discover
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => useSwipeStore.setState({ swipeState: "filter" })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <FontAwesome name="filter" color={colors.body} size={16} />
            <AppText style={{ color: colors.body }} className="text-xl">
              Edit filters
            </AppText>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar />

      <Text className="text-accent text-5xl">SWIPING SCREEN</Text>
    </View>
  );
}

export default function Index() {
  const swipeState = useSwipeStore((state) => state.swipeState);

  return (
    <CustomScreen>
      {swipeState === "filter" ? <FilterScreen /> : <SwipeScreen />}

      {/* <Link
          href={"./my-list/"}
          className="font-nunito text-blue-300 text-3xl"
        >
          Go to My list
        </Link> */}
    </CustomScreen>
  );
}
