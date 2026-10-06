import { ReactNode } from "react";
import { View } from "react-native";

type CenteredContentProps = {
  children: ReactNode;
};

export default function CenteredContent({ children }: CenteredContentProps) {
  return <View className="flex-1 items-center justify-center">{children}</View>;
}
