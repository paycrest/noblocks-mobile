import React, { FunctionComponent } from "react";

import { Colors } from "@/constants/Colors";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { Circle } from "lucide-react-native";
import DarkCheckMark from "./svgs/dark-checkMark";

interface Props {
  checked: boolean;
}

const Check: FunctionComponent<Props> = ({ checked }) => {
  const colorScheme = useAppColorScheme();

  return (
    <>
      {checked ? (
        <DarkCheckMark />
      ) : (
        <Circle
          color={
            colorScheme === "dark"
              ? Colors.dark.secondary
              : Colors.light.secondary
          }
          size={20}
        />
      )}
    </>
  );
};

export default Check;
