import LinearGradient from "react-native-linear-gradient";
import { StyleSheet, View } from "react-native";
import { COLORS, SPACING } from "../theme/theme";
import Icon from "./icon";

interface GradientBGIconProps {
  name: string;
  color: string;
  size: number;
}

export function GradientBgIcon({ name, color, size }: GradientBGIconProps) {
  return (
    <View style={styles.Container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
        style={styles.LinearGradientBG}
      >
        <Icon name={name} color={color} size={size} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    borderWidth: 2,
    borderColor: COLORS.secondaryDarkGreyHex,
    borderRadius: SPACING.space_12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondaryDarkGreyHex,
    overflow: "hidden",
  },
  LinearGradientBG: {
    height: SPACING.space_36,
    width: SPACING.space_36,
    alignItems: "center",
    justifyContent: "center",
  },
});
