import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../theme/theme";
import { StyleSheet, Text, View } from "react-native";
import { GradientBgIcon } from "./GradientBgIcon";
import { ProfilePic } from "./ProfilePic";

interface HeaderBarProps {
  title?: string;
}

export function HeaderBar({ title }: HeaderBarProps) {
  return (
    <View style={styles.HeaderContainer}>
      <GradientBgIcon
        name="menu"
        color={COLORS.primaryLightGreyHex}
        size={FONTSIZE.size_16}
      />
      <Text style={styles.HeaderText}>{title}</Text>
      <ProfilePic />
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderContainer: {
    padding: SPACING.space_30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
});
