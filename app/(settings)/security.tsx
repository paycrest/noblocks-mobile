import React, { FunctionComponent, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import Chip from "@/components/Chip";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import ListItem from "@/components/settings/ListItem";
import BackupCodesModal from "@/components/settings/modals/BackupCodesModal";
import ScreenHeader from "@/components/settings/ScreenHeader";
import AppSwitch from "@/components/Switch";
import { useThemeColors } from "@/hooks/useThemeColor";

const Security: FunctionComponent = () => {
  const [is2FAModalVisible, setIs2FAModalVisible] = useState<boolean>(false);
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
          <TouchableOpacity onPress={() => setIs2FAModalVisible(true)}>
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
          </TouchableOpacity>
        </View>
        {/* <TwoFAModal
          isVisible={is2FAModalVisible}
          onClose={() => setIs2FAModalVisible(false)}
        /> */}
        {/* <QRCodeAuthModal
          isVisible={is2FAModalVisible}
          onClose={() => setIs2FAModalVisible(false)}
        /> */}
        <BackupCodesModal
          isVisible={is2FAModalVisible}
          onClose={() => setIs2FAModalVisible(false)}
        />
      </View>
    </AppLayout>
  );
};

export default Security;
