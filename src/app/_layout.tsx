import CenteredContent from "@/components/centered-content";
import CustomScreen from "@/components/custom-screen";
import { db } from "@/lib/server/db/client";
import migrations from "@/lib/server/db/migrations/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";

import "../../global.css";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

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

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
