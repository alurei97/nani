import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CustomScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function CustomScreen({ children, style }: CustomScreenProps) {
  return (
    <SafeAreaView
      className="flex-1 bg-app"
      style={{
        ...style,
        paddingTop: 0,
        paddingBottom: 20,
        paddingHorizontal: 20,
      }}
    >
      {children}
    </SafeAreaView>
  );
}
