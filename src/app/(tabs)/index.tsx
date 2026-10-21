import { AppText, AppText as Text } from "@/components/app-text";
import CustomScreen from "@/components/custom-screen";
import colors from "@/constants/colors.json";
import { GENRES } from "@/lib/anilist/types";
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

  function GenresList() {
    const selectedGenres = useFilterStore((state) => state.selectedGenres);
    const toggleGenre = useFilterStore((state) => state.toggleGenre);

    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {GENRES.map((g) => {
          const selected = selectedGenres.includes(g);

          const textColor = selected ? colors.accent : colors.body;
          const borderColor = selected ? colors.accent : colors.body;
          const backgroundColor = selected
            ? "rgba(168, 85, 247, 0.12)"
            : "transparent";

          return (
            <Pressable
              key={g}
              onPress={() => toggleGenre(g)}
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
              }}
            >
              <Text style={{ color: textColor }}>{g}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar />

      <View style={{ gap: 10 }}>
        <Text className="text-white">GENRE</Text>
        <GenresList />

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
    </CustomScreen>
  );
}
