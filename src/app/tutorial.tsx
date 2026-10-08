import { AppText } from "@/components/app-text";
import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import colors from "@/constants/colors.json";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

const maxSteps = 4;

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
      style={{ color: "rgba(255, 255, 255, 0.8)" }}
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

function ExplanationTitle({ step }: { step: number }) {
  function getTextIcon(step: number) {
    switch (step) {
      case 1:
        return "arrow-right" as const;
      case 2:
        return "arrow-left" as const;
      case 3:
        return "hand-pointer-o" as const;
      default:
        return "th-large" as const;
    }
  }

  function getText(step: number) {
    switch (step) {
      case 1:
        return "Swipe right to save" as const;
      case 2:
        return "Swipe left to discard" as const;
      case 3:
        return "Tap to see anime info" as const;
      default:
        return "Find it in My List" as const;
    }
  }

  const icon = getTextIcon(step);
  const text = getText(step);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 20,
      }}
    >
      <FontAwesome name={icon} color={colors.accent} size={22} />
      <AppText weight="bold" className="text-accent text-2xl">
        {text}
      </AppText>
    </View>
  );
}

function Explanation({ step }: { step: number }) {
  function getText(step: number) {
    switch (step) {
      case 1:
        return "Caught you eye?\nSwipe to the right to save it to your list." as const;
      case 2:
        return "Not for you?\nSwipe left to move on." as const;
      case 3:
        return "Want to know more?\nTap a card to see its details." as const;
      default:
        return "Your saved anime will be waiting for you there." as const;
    }
  }

  const text = getText(step);

  return (
    <AppText
      className="text-xl self-center text-center"
      style={{
        color: colors.body,
      }}
    >
      {text}
    </AppText>
  );
}

function Steps({ step }: { step: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 20,
      }}
    >
      <FontAwesome
        name="circle"
        color={colors.accent}
        size={16}
        style={{ opacity: step >= 1 ? 1 : 0.3 }}
      />
      <FontAwesome
        name="circle"
        color={colors.accent}
        size={16}
        style={{ opacity: step >= 2 ? 1 : 0.3 }}
      />
      <FontAwesome
        name="circle"
        color={colors.accent}
        size={16}
        style={{ opacity: step >= 3 ? 1 : 0.3 }}
      />
      <FontAwesome
        name="circle"
        color={colors.accent}
        size={16}
        style={{ opacity: step >= 4 ? 1 : 0.3 }}
      />
    </View>
  );
}

function NextButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        console.log(">>> Next button pressed");
        onPress();
      }}
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
        marginTop: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <AppText weight="bold" className="text-accent text-xl">
          Next
        </AppText>
        <FontAwesome name="chevron-right" color={colors.accent} size={14} />
      </View>
    </Pressable>
  );
}

export default function Tutorial() {
  const [step, setStep] = useState(1);

  const router = useRouter();

  return (
    <CustomScreen>
      <CenteredContent style={{ gap: 10 }}>
        <SkipText />
        <Title />
        <AnimeTutorialCard />
        <ExplanationTitle step={step} />
        <Explanation step={step} />
        <Steps step={step} />
        <NextButton
          onPress={() => {
            if (step === maxSteps) router.back();
            setStep(step + 1);
          }}
        />
      </CenteredContent>
    </CustomScreen>
  );
}
