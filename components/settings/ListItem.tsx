import React, { FunctionComponent, ReactElement } from "react";

import { View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";

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
  return (
    <View className="flex-row w-full  mt-8">
      <View>
        <ResponsiveUi.Text semiBold small>
          {title}
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          secondary
          style={{
            width: 300,
            marginTop: 10,
          }}
          xs
        >
          {subtitle}
        </ResponsiveUi.Text>
      </View>
      <View style={{ width: 50 }}>{rightComponent}</View>
    </View>
  );
};

export default ListItem;
