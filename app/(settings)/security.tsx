import React, { FunctionComponent, useState } from "react";
import { Pressable, View } from "react-native";

import AppLayout from "@/components/layouts/AppLayout";
import AppSwitch from "@/components/Switch";
import Chip from "@/components/Chip";
import ListItem from "@/components/settings/ListItem";
import QRCodeAuthModal from "@/components/settings/modals/QRCodeAuthModal";
import TwoFAModal, {
  TwoFAMethod,
} from "@/components/settings/modals/TwoFAModal";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import ScreenHeader from "@/components/settings/ScreenHeader";
import FaceIdIcon from "@/components/svgs/face-id-icon";
import SquarePasswordIcon from "@/components/svgs/square-password-icon";
import TwoFactorIcon from "@/components/svgs/two-factor-icon";
import useAuth from "@/hooks/auth/useAuth";
import { useThemeColors } from "@/hooks/useThemeColor";

const Security: FunctionComponent = () => {
  const [is2FAModalVisible, setIs2FAModalVisible] = useState(false);
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);
  const [isFaceIdEnabled, setIsFaceIdEnabled] = useState(false);
  const {
    handleEnrollmentWithPasskey,
    handleEnrollmentWithTotp,
    handleEnrollmentWithSms,
    verifyTotpEnrollment,
  } = useAuth();
  const colors = useThemeColors();

  const handleTwoFAContinue = async (method: TwoFAMethod) => {
    setIs2FAModalVisible(false);

    if (method === "authenticator") {
      const started = await handleEnrollmentWithTotp();
      if (started) {
        setIsQrModalVisible(true);
      }
      return;
    }

    await handleEnrollmentWithSms();
  };

  return (
    <>
      <AppLayout>
        <View className="w-full">
          <ScreenHeader screenTitle="Security" />
          <View style={{ paddingHorizontal: 16, marginTop: 8, gap: 20 }}>
            <ListItem
              title="Face ID"
              subtitle="Enable face ID for app login and approving transactions for added security."
              leadingIcon={<FaceIdIcon color={colors.text} />}
              rightComponent={
                <AppSwitch
                  value={isFaceIdEnabled}
                  onToggle={async (state) => {
                    if (state) {
                      const enrolled = await handleEnrollmentWithPasskey();
                      setIsFaceIdEnabled(enrolled);
                      return;
                    }

                    setIsFaceIdEnabled(false);
                  }}
                />
              }
            />

            <View>
              <ListItem
                title="Password"
                subtitle="Set a password for additional account protection."
                leadingIcon={<SquarePasswordIcon color={colors.text} />}
                rightComponent={<Chip text="Not set" />}
              />
              <Pressable
                style={{ paddingLeft: 42, paddingVertical: 8 }}
                onPress={() => {}}
              >
                <ResponsiveUi.Text
                  semiBold
                  style={{ color: colors.slate, fontSize: 18, lineHeight: 24 }}
                >
                  Set Password
                </ResponsiveUi.Text>
              </Pressable>
            </View>

            <View>
              <ListItem
                title="2-Factor Authentication"
                subtitle="Add an extra layer of security with SMS or an authenticator app."
                leadingIcon={<TwoFactorIcon color={colors.text} />}
                rightComponent={<Chip text="Not set" />}
              />
              <Pressable
                style={{ paddingLeft: 42, paddingVertical: 8 }}
                onPress={() => setIs2FAModalVisible(true)}
              >
                <ResponsiveUi.Text
                  semiBold
                  style={{ color: colors.slate, fontSize: 18, lineHeight: 24 }}
                >
                  Add 2FA
                </ResponsiveUi.Text>
              </Pressable>
            </View>
          </View>
        </View>
      </AppLayout>

      <TwoFAModal
        isVisible={is2FAModalVisible}
        onClose={() => setIs2FAModalVisible(false)}
        onContinue={handleTwoFAContinue}
      />
      <QRCodeAuthModal
        isVisible={isQrModalVisible}
        onClose={() => setIsQrModalVisible(false)}
        onVerify={verifyTotpEnrollment}
      />
    </>
  );
};

export default Security;
