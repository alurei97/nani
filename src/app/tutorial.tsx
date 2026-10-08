import { AppText } from "@/components/app-text";
import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import colors from "@/constants/colors.json";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

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

function AnimeTutorialCard({ step }: { step: number }) {
  const duration = 2000;
  const xPosition = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (step === 1) {
      xPosition.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(40, { duration: duration }),
      );
      rotation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(4, { duration: duration }),
      );
      opacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: duration }),
      );
    } else if (step === 2) {
      xPosition.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-40, { duration: duration }),
      );
      rotation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-4, { duration: duration }),
      );
      opacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: duration }),
      );
    } else if (step === 3) {
      xPosition.value = 0;
      rotation.value = 0;
      opacity.value = 0;
    }
  }, [step]);

  const cardAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: xPosition.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const iconsAnimatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  function SwipeIcon() {
    if (step >= 3) {
      return null;
    }

    const left = step === 1 ? null : 20;
    const right = step === 1 ? 20 : null;

    const name = step === 1 ? "heart-o" : "times";
    const color = step === 1 ? colors.swipeSave : colors.swipeCancel;
    const colorBg = step === 1 ? colors.swipeSaveBg : colors.swipeCancelBg;

    return (
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 20,
            left: left,
            right: right,
            width: 72,
            height: 72,
            padding: 0,
            borderRadius: 36,
            borderWidth: 3,
            borderColor: color,
            backgroundColor: colorBg,
            alignItems: "center",
            justifyContent: "center",
          },
          iconsAnimatedStyles,
        ]}
      >
        <FontAwesome name={name} color={color} size={40} />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        {
          width: "75%",
          aspectRatio: 2 / 3,
          alignSelf: "center",
          position: "relative",
          borderRadius: 30,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.14)",
          overflow: "hidden",
          marginTop: 16,
        },
        cardAnimatedStyles,
      ]}
    >
      <Image
        source={TUTORIAL_ANIME.coverImage}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />

      <SwipeIcon />

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
        <AppText weight="bold" style={{ color: "white" }} className="text-xl">
          {TUTORIAL_ANIME.title}
        </AppText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <FontAwesome name="star" color={colors.score} size={20} />
          <AppText weight="bold" className="text-score text-xl">
            {TUTORIAL_ANIME.averageScore}
          </AppText>
        </View>
      </LinearGradient>
    </Animated.View>
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
        return "Your saved animes will be waiting for you there." as const;
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

function NextButton({ step, onPress }: { step: number; onPress: () => void }) {
  function getText(step: number) {
    switch (step) {
      case maxSteps:
        return "Got it!" as const;
      default:
        return "Next" as const;
    }
  }

  const text = getText(step);

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
          {text}
        </AppText>
        {step !== maxSteps && (
          <FontAwesome name="chevron-right" color={colors.accent} size={14} />
        )}
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
        <AnimeTutorialCard step={step} />
        <ExplanationTitle step={step} />
        <Explanation step={step} />
        <Steps step={step} />
        <NextButton
          step={step}
          onPress={() => {
            if (step === maxSteps) {
              router.back();
              return;
            }

            setStep((currentStep) => currentStep + 1);
          }}
        />
      </CenteredContent>
    </CustomScreen>
  );
}
