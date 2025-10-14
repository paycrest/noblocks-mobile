import React, { FunctionComponent, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import AppLayout from "@/components/layouts/AppLayout";
import AppSwitch from "@/components/Switch";
import BackupCodesModal from "@/components/settings/modals/BackupCodesModal";
import Chip from "@/components/Chip";
import ListItem from "@/components/settings/ListItem";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import ScreenHeader from "@/components/settings/ScreenHeader";
import useAuth from "@/hooks/auth/useAuth";
import { useThemeColors } from "@/hooks/useThemeColor";

const Security: FunctionComponent = () => {
  const [is2FAModalVisible, setIs2FAModalVisible] = useState<boolean>(false);
  const { handleEnrollmentWithPasskey } = useAuth();
  const color = useThemeColors();
  return (
    <AppLayout>
      <View className="w-full">
        <ScreenHeader screenTitle="Security" />
        <View className="mx-3">
          <ListItem
            title="Face ID"
            subtitle="Enable face ID for app login and approving transactions for added security."
            rightComponent={
              <AppSwitch
                onToggle={(state) => {
                  const response = handleEnrollmentWithPasskey();
                }}
              />
            }
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
          <TouchableOpacity onPress={handleEnrollmentWithPasskey}>
            <ResponsiveUi.Text
              tailwind="mt-3"
              style={{
                color: color.slate,
              }}
              small
              semiBold
            >
              Link account to passkey
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
