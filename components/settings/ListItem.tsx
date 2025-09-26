import React, { FunctionComponent, ReactElement } from "react";

import { ResponsiveUi } from "../ResponsiveUi";
import { View } from "react-native";
import { useAppDimensions } from "@/hooks/useAppDimensions";

interface Props {
  title: string;
  subtitle: string;
  rightComponent: ReactElement;
}

const ListItem: FunctionComponent<Props> = ({
  title,
  subtitle,
  rightComponent,
}) => {
  const { wp } = useAppDimensions();
  return (
    <View className="flex-row mt-8">
      <View>
        <ResponsiveUi.Text semiBold small>
          {title}
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          secondary
          style={{
            width: wp(75),
            marginTop: 10,
          }}
          xs
        >
          {subtitle}
        </ResponsiveUi.Text>
      </View>
      <View style={{ width: wp(15) }}>{rightComponent}</View>
    </View>
  );
};

export default ListItem;
