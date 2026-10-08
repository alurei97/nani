import { ReactNode } from "react";
import { View , ViewProps } from "react-native";

type CenteredContentProps = ViewProps & {
  children: ReactNode;
};

export default function CenteredContent({
  children,
  ...props
}: CenteredContentProps) {
  return (
    <View className="flex-1 items-center justify-center" {...props}>
      {children}
    </View>
  );
}
