import React, { FunctionComponent } from "react";

import Chip from "@/components/Chip";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import ListItem from "@/components/settings/ListItem";
import ScreenHeader from "@/components/settings/ScreenHeader";
import AppSwitch from "@/components/Switch";
import { useThemeColors } from "@/hooks/useThemeColor";
import { View } from "react-native";

const Security: FunctionComponent = () => {
  const color = useThemeColors();
  return (
    <AppLayout>
      <View className="w-full mx-1">
        <ScreenHeader screenTitle="Security" />
        <View className="mx-5">
          <ListItem
            title="Face ID"
            subtitle="Enable face ID for app login and approving transactions for added security."
            rightComponent={<AppSwitch onToggle={(state) => {}} />}
          />
          <ListItem
            title="Password"
            subtitle="Notification sound"
            rightComponent={<Chip text={"Not set"} />}
          />
          <ResponsiveUi.Text
            tailwind="mt-3"
            style={{
              color: color.slate,
            }}
            small
            semiBold
          >
            Set Password
          </ResponsiveUi.Text>
          <ListItem
            title="2-Factor Authentication"
            subtitle="Notification sound"
            rightComponent={<Chip text={"Not set"} />}
          />
          <ResponsiveUi.Text
            tailwind="mt-3"
            style={{
              color: color.slate,
            }}
            small
            semiBold
          >
            Add 2FA
          </ResponsiveUi.Text>
        </View>
      </View>
    </AppLayout>
  );
};

export default Security;
