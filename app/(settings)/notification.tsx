import React, { FunctionComponent, useState } from "react";

import AppLayout from "@/components/layouts/AppLayout";
import ListItem from "@/components/settings/ListItem";
import ScreenHeader from "@/components/settings/ScreenHeader";
import AppSwitch from "@/components/Switch";
import { View } from "react-native";

const Notification: FunctionComponent = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] =
    useState(false);

  return (
    <AppLayout>
      <View className="w-full">
        <ScreenHeader screenTitle="Notifications" />
        <View className="mx-8">
          <ListItem
            title="Push notifications"
            subtitle="See push notifications about events like swaps, deposits, and withdrawals."
            rightComponent={
              <AppSwitch
                onToggle={(state) => setIsPushNotificationsEnabled(state)}
              />
            }
          />
          <ListItem
            title="Notification sound"
            subtitle="Play notification sounds on success events from swaps, deposits, and withdrawals"
            rightComponent={
              <AppSwitch
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
