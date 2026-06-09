import React, { ReactElement } from "react";
import { View } from "react-native";

type Props = {
  focused: boolean;
  children: ReactElement;
};

export function TabBarIcon({ focused, children }: Props) {
  return <View style={{ opacity: focused ? 1 : 0.4 }}>{children}</View>;
}
