import { Text as NativeText, type TextProps } from "react-native";

type AppTextProps = TextProps & {
  className?: string;
  weight?: "regular" | "bold";
};

export function AppText({
  className,
  weight = "regular",
  ...props
}: AppTextProps) {
  const fontClass = weight === "bold" ? "font-nunito-extrabold" : "font-nunito";
  const classes = className ? `${fontClass} ${className}` : fontClass;

  return <NativeText {...props} className={classes} />;
}
