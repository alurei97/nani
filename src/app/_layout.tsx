import { AppText as Text } from "@/components/app-text";
import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import colors from "@/constants/colors.json";
import { getTutorialSeen } from "@/lib/local_storage/local-storage";
import { db } from "@/lib/server/db/client";
import migrations from "@/lib/server/db/migrations/migrations";
import {
  Nunito_400Regular,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import "../../global.css";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_800ExtraBold,
  });

  const [tutorialSeen, setTutorialSeen] = useState<boolean | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadTutorialSeen = async () => {
      const result = await getTutorialSeen();
      setTutorialSeen(result);
      console.log(">>> Tutorial seen:", result);
      // deleteAll();
    };

    void loadTutorialSeen();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && success && tutorialSeen === false) {
      router.push("/tutorial");
      // saveTutorialSeen();
    }
  }, [fontsLoaded, fontError, success, tutorialSeen, router]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (error) {
    return (
      <CustomScreen>
        <CenteredContent>
          <Text className="text-accent text-2xl">Database setup failed:</Text>
        </CenteredContent>
      </CustomScreen>
    );
  }

  if (!success) {
    return (
      <CustomScreen>
        <CenteredContent>
          <Text className="text-accent text-5xl">Preparing database...</Text>
        </CenteredContent>
      </CustomScreen>
    );
  }

  if (tutorialSeen === null) {
    return (
      <CenteredContent>
        <ActivityIndicator size="large" color={colors.accent} />
      </CenteredContent>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tutorial" options={{ presentation: "card" }} />
      </Stack>
    </>
  );
}
