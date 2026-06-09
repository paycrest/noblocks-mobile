import React, { FunctionComponent, ReactElement } from "react";
import { View } from "react-native";

import { useAppDimensions } from "@/hooks/useAppDimensions";
import { ResponsiveUi } from "../ResponsiveUi";

interface Props {
  title: string;
  subtitle: string;
  rightComponent: ReactElement;
  leadingIcon?: ReactElement;
}

const ListItem: FunctionComponent<Props> = ({
  title,
  subtitle,
  rightComponent,
  leadingIcon,
}) => {
  const { wp } = useAppDimensions();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 22,
      }}
    >
      {leadingIcon ? (
        <View style={{ width: 20, height: 20, marginTop: 2 }}>{leadingIcon}</View>
      ) : null}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start" }}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <ResponsiveUi.Text
            semiBold
            style={{ fontSize: 16, lineHeight: 24 }}
          >
            {title}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text
            secondary
            style={{
              width: wp(72),
              marginTop: 12,
              fontSize: 12,
              lineHeight: 16,
            }}
          >
            {subtitle}
          </ResponsiveUi.Text>
        </View>
        <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

export default ListItem;
