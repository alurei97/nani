import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import {
  getTutorialSeen
} from "@/lib/local_storage/local-storage";
import { db } from "@/lib/server/db/client";
import migrations from "@/lib/server/db/migrations/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import "../../global.css";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

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
    if (success && tutorialSeen === false) {
      router.push("/tutorial");
      // saveTutorialSeen();
    }
  }, [success, tutorialSeen, router]);

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
        <ActivityIndicator size="large" color="#a855f7" />
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
