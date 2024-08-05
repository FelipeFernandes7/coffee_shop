import { StyleSheet, View } from "react-native";
import { BORDERRADIUS, SPACING } from "../theme/theme";
import Icon from "./icon";

type BgIconProps = {
  name: string;
  color: string;
  size: number;
  BGColor: string;
};

export function BgIcon({ name, color, size, BGColor }: BgIconProps) {
  return (
    <View style={[styles.IconBG, { backgroundColor: BGColor }]}>
      <Icon name={name} color={color} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  IconBG: {
    height: SPACING.space_30,
    width: SPACING.space_30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BORDERRADIUS.radius_8,
  },
});
