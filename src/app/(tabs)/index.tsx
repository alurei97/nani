import CustomScreen from "@/components/custom_screen";
import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";

export default function Index() {
  return (
    <CustomScreen style={styles.container}>
      <Text className="text-accent text-5xl">DISCOVER SCREEN</Text>

      <Link href={"./my_list/"} className="text-blue-300 text-3xl">
        Go to My list
      </Link>
    </CustomScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
