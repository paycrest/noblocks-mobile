import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";

import AppLayout from "@/components/layouts/AppLayout";
import ListItem from "@/components/settings/ListItem";
import ScreenHeader from "@/components/settings/ScreenHeader";
import AppSwitch from "@/components/Switch";
import NotificationSquareIcon from "@/components/svgs/notification-square-icon";
import VolumeHighIcon from "@/components/svgs/volume-high-icon";
import { useThemeColors } from "@/hooks/useThemeColor";

const Notification: FunctionComponent = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] =
    useState(false);
  const colors = useThemeColors();

  return (
    <AppLayout>
      <View className="w-full">
        <ScreenHeader screenTitle="Notifications" />
        <View style={{ paddingHorizontal: 16, marginTop: 8, gap: 20 }}>
          <ListItem
            title="Push notifications"
            subtitle="See push notifications about events like swaps, deposits, and withdrawals."
            leadingIcon={<NotificationSquareIcon color={colors.text} />}
            rightComponent={
              <AppSwitch
                value={isPushNotificationsEnabled}
                onToggle={(state) => setIsPushNotificationsEnabled(state)}
              />
            }
          />
          <ListItem
            title="Notification sound"
            subtitle="Play notification sounds on success events from swaps, deposits, and withdrawals"
            leadingIcon={<VolumeHighIcon color={colors.text} />}
            rightComponent={
              <AppSwitch
                value={isNotificationsEnabled}
                onToggle={(state) => setIsNotificationsEnabled(state)}
              />
            }
          />
        </View>
      </View>
    </AppLayout>
  );
};

export default Notification;
