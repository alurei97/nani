import { AppText } from "@/components/app-text";
import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import colors from "@/constants/colors.json";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, View } from "react-native";

const TUTORIAL_ANIME = {
  title: "Fullmetal Alchemist: Brotherhood",
  coverImage:
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-KJTQz9AIm6Wk.jpg",
  averageScore: 94,
};

function SkipText() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.back()}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
      }}
    >
      <AppText style={{ color: colors.body }}>Skip</AppText>
    </Pressable>
  );
}

function Title() {
  return (
    <AppText
      className=" text-2xl"
      style={{
        color: "rgba(255, 255, 255, 0.8)",
      }}
    >
      How it works
    </AppText>
  );
}

function AnimeTutorialCard() {
  return (
    <View
      style={{
        width: "75%",
        aspectRatio: 2 / 3,
        alignSelf: "center",
        position: "relative",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.14)",
        overflow: "hidden",
        marginTop: 16,
      }}
    >
      <Image
        source={TUTORIAL_ANIME.coverImage}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />

      <LinearGradient
        colors={["rgba(13, 13, 15, 0)", "rgba(13, 13, 15, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 150,
          padding: 16,
          justifyContent: "flex-end",
        }}
      >
        <AppText weight="bold" style={{ color: "white" }}>
          {TUTORIAL_ANIME.title}
        </AppText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <FontAwesome name="star" color={colors.score} size={18} />
          <AppText weight="bold" className="text-score">
            {TUTORIAL_ANIME.averageScore}
          </AppText>
        </View>
      </LinearGradient>
    </View>
  );
}

function ExplanationTitle() {
  //TODO: depending on step
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 10,
      }}
    >
      <FontAwesome name="arrow-right" color={colors.accent} size={22} />
      <AppText weight="bold" className="text-accent text-2xl">
        Swipe right to save
      </AppText>
    </View>
  );
}

function Explanation() {
  //TODO: depending on step
  return (
    <AppText
      className="text-xl self-center text-center"
      style={{
        color: colors.body,
      }}
    >
      {" Caught you eye?\nSwipe to the right to save it to your list."}
    </AppText>
  );
}

function Steps() {
  //TODO : depending on step
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 16,
      }}
    >
      <FontAwesome name="circle" color={colors.accent} size={16} />
      <FontAwesome
        name="circle"
        color={colors.accent}
        size={16}
        style={{ opacity: 0.3 }}
      />
      <FontAwesome
        name="circle"
        color={colors.accent}
        size={16}
        style={{ opacity: 0.3 }}
      />
    </View>
  );
}

function NextButton() {
  return (
    <View
      style={{
        width: "100%",
        alignSelf: "center",
        borderRadius: 20,
        borderColor: "rgba(168, 85, 247, 0.5)",
        borderWidth: 1,
        backgroundColor: "rgba(168, 85, 247, 0.15)",
        padding: 18,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <AppText weight="bold" className="text-accent text-xl">
          Next
        </AppText>
        <FontAwesome name="chevron-right" color={colors.accent} size={14} />
      </View>
    </View>
  );
}

export default function Tutorial() {
  return (
    <CustomScreen>
      <CenteredContent style={{ gap: 10 }}>
        <SkipText />
        <Title />
        <AnimeTutorialCard />
        <ExplanationTitle />
        <Explanation />
        <Steps />
        <NextButton />
      </CenteredContent>
    </CustomScreen>
  );
}
