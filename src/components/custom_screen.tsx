import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CustomScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function 
({ children, style }: CustomScreenProps) {
  return <SafeAreaView style={[style, { flex: 1 }]}>{children}</SafeAreaView>;
}
