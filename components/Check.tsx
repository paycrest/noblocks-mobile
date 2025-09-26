import { useThemeColors } from "@/hooks/useThemeColor";
import { Circle } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import CheckSquareIcon from "./svgs/check-square-icon";
import DarkCheckMark from "./svgs/dark-checkMark";
import UncheckedSquareIcon from "./svgs/unchecked-square-icon";

interface Props {
  checked: boolean;
  type?: "square" | "circle";
  onPress?: () => void;
}

const Check: React.FC<Props> = ({ checked, type = "circle", onPress }) => {
  const colors = useThemeColors();

  const renderIcon = () => {
    if (type === "circle") {
      return checked ? (
        <DarkCheckMark />
      ) : (
        <Circle color={colors.secondary} size={20} />
      );
    }

    if (type === "square") {
      return checked ? <CheckSquareIcon /> : <UncheckedSquareIcon />;
    }

    return null;
  };

  return <Pressable onPress={onPress}>{renderIcon()}</Pressable>;
};

export default Check;
