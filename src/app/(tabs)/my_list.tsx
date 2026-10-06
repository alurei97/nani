import CustomScreen from "@/components/custom_screen";
import { StyleSheet, Text } from "react-native";

export default function Index() {
  return (
    <CustomScreen style={styles.container}>
      <Text className="text-status-completed text-5xl">MY LIST</Text>
    </CustomScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
