import React, { FunctionComponent } from "react";

import { View } from "react-native";
import { ResponsiveUi } from "./ResponsiveUi";

interface Props {
  text: string;
}

const Chip: FunctionComponent<Props> = ({ text }) => {
  return (
    <View
      className="border-[0.5px] border-accent-gray-bolder rounded-xl items-center"
      style={{ paddingHorizontal: 8, paddingVertical: 4 }}
    >
      <ResponsiveUi.Text
        light
        style={{ fontSize: 10, lineHeight: 14 }}
      >
        {text}
      </ResponsiveUi.Text>
    </View>
  );
};

export default Chip;
