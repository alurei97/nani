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
import FlipCard from "react-native-flip-card";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const maxSteps = 4;
const duration = 1500;

const TUTORIAL_ANIME = {
  id: 154587,
  title: "Frieren: Beyond Journey's End",
  coverImage:
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-qQTzQnEJJ3oB.jpg",
  bannerImage:
    "https://s4.anilist.co/file/anilistcdn/media/anime/banner/154587-ivXNJ23SM1xB.jpg",
  averageScore: 91,
  format: "TV",
  episodes: 28,
  genres: ["Adventure", "Drama", "Fantasy"],
  synopsis:
    "Years after defeating the Demon King, elf mage Frieren begins a new journey to understand life, mortality, and the people she once traveled with.",
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
      className=" text-3xl"
      style={{ color: "rgba(255, 255, 255, 0.8)" }}
    >
      How it works
    </AppText>
  );
}

function AnimeTutorialCard({ step }: { step: number }) {
  const cardX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const handY = useSharedValue(75);
  const handOpacity = useSharedValue(0);

  useEffect(() => {
    if (step === 1) {
      cardX.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(40, { duration: duration }),
      );
      rotation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(4, { duration: duration }),
      );
      iconOpacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration }),
      );
    } else if (step === 2) {
      cardX.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-40, { duration }),
      );
      rotation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-4, { duration }),
      );
      iconOpacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration }),
      );
    } else if (step === 3) {
      setIsFlipped(false);

      cardX.value = 0;
      rotation.value = 0;
      iconOpacity.value = 0;

      rippleOpacity.value = withSequence(
        withTiming(0, { duration: duration / 2 }),
        withTiming(1, { duration: 0 }),
        withTiming(0, { duration: duration / 2 }),
      );
      rippleScale.value = 0;
      rippleScale.value = withDelay(
        duration / 2,
        withTiming(7, { duration: duration / 2 }),
      );

      handY.value = withSequence(withTiming(50, { duration: duration / 2 }));
      handOpacity.value = withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(1, { duration: duration / 2 }),
        withTiming(0, { duration: 0 }),
      );

      const timer = setTimeout(() => setIsFlipped(true), duration);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const cardAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: cardX.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const iconsAnimatedStyles = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
  }));

  const rippleAnimatedStyles = useAnimatedStyle(() => ({
    opacity: rippleOpacity.value,
    transform: [{ scale: rippleScale.value }],
  }));

  const handAnimatedStyles = useAnimatedStyle(() => ({
    opacity: handOpacity.value,
    transform: [{ translateY: handY.value }],
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

  function Ripple() {
    return (
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: "center",
            justifyContent: "center",
          },
          rippleAnimatedStyles,
        ]}
      >
        <FontAwesome name="circle-o" color={colors.accent} size={100} />
      </Animated.View>
    );
  }

  function Hand() {
    return (
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: "center",
            justifyContent: "center",
          },
          handAnimatedStyles,
        ]}
      >
        <FontAwesome name="hand-pointer-o" color={colors.accent} size={100} />
      </Animated.View>
    );
  }

  function FrontCard() {
    return (
      <Animated.View
        style={[
          {
            flex: 1,
            width: "100%",
            alignSelf: "center",
            position: "relative",
            borderRadius: 30,
            borderWidth: 1,
            borderColor: colors.cardBorder,
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

        <Hand />
        <Ripple />

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

  function BackCard() {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          alignSelf: "center",
          position: "relative",
          borderRadius: 30,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          overflow: "hidden",
          marginTop: 16,
          backgroundColor: colors.cardSurface,
        }}
      >
        <View style={{ width: "100%", height: "50%", position: "relative" }}>
          <Image
            source={TUTORIAL_ANIME.bannerImage}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(22, 22, 34, 0)", colors.cardSurface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 56,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: 16,
            gap: 0,
          }}
        >
          <AppText weight="bold" className="text-lg text-white">
            {TUTORIAL_ANIME.title}
          </AppText>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <FontAwesome name="star" color={colors.score} size={16} />
            <AppText weight="bold" className="text-score">
              {TUTORIAL_ANIME.averageScore}
            </AppText>
          </View>

          <AppText
            className="text-base"
            style={{ color: colors.body, marginTop: 8 }}
            numberOfLines={7}
          >
            {TUTORIAL_ANIME.synopsis}
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <FlipCard
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
      flipHorizontal={true}
      flipVertical={false}
      friction={10}
      clickable={false}
      flip={step === 3 && isFlipped}
    >
      <FrontCard />
      <BackCard />
    </FlipCard>
  );
}

function ListPreview() {
  function HardcodedCard() {
    return (
      <View
        style={{
          width: "50%",
          aspectRatio: 2 / 3,
          alignSelf: "center",
          position: "relative",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          overflow: "hidden",
          backgroundColor: colors.cardSurface,
        }}
      >
        <Image
          source={TUTORIAL_ANIME.coverImage}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>
    );
  }

  function GridCard() {
    return (
      <View
        style={{
          width: "50%",
          aspectRatio: 2 / 3,
          alignSelf: "center",
          position: "relative",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          overflow: "hidden",
          backgroundColor: colors.cardSurface,
        }}
      ></View>
    );
  }

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        padding: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 20,
        }}
      >
        <HardcodedCard />
        <GridCard />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 10,
        }}
      >
        <GridCard />
        <GridCard />
      </View>
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
        return "Your saved animes will be\nwaiting for you there." as const;
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

function AnimatedStage({ step }: { step: number }) {
  const cardStageOpacity = useSharedValue(1);
  const cardStageScale = useSharedValue(1);
  const cardStageX = useSharedValue<`${number}%`>("0%");
  const cardStageY = useSharedValue<`${number}%`>("0%");
  const listStageOpacity = useSharedValue(0);
  const listStageY = useSharedValue(80);

  useEffect(() => {
    if (step === maxSteps) {
      cardStageOpacity.value = withTiming(0, { duration: duration });
      cardStageScale.value = withTiming(0.5, { duration: duration });
      cardStageX.value = withTiming("-20%", { duration: duration });
      cardStageY.value = withTiming("-20%", { duration: duration });

      listStageOpacity.value = 1;
      listStageY.value = withTiming(0, { duration: duration });
    }
  });

  const cardStageStyle = useAnimatedStyle(() => ({
    opacity: cardStageOpacity.value,
    transform: [
      { translateX: cardStageX.value },
      { translateY: cardStageY.value },
      { scale: cardStageScale.value },
    ],
  }));

  const listStageStyle = useAnimatedStyle(() => ({
    opacity: listStageOpacity.value,
    transform: [{ translateY: listStageY.value }],
  }));

  return (
    <View
      style={{
        width: "75%",
        aspectRatio: 2 / 3,
        alignSelf: "center",
        position: "relative",
        marginTop: 16,
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
          listStageStyle,
        ]}
      >
        <ListPreview />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
          cardStageStyle,
        ]}
      >
        <AnimeTutorialCard step={step} />
      </Animated.View>
    </View>
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
        <AnimatedStage step={step} />
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
