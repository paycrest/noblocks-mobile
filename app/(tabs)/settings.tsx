import React, { FunctionComponent, useState } from "react";

import AppLayout from "@/components/layouts/AppLayout";
import RevealCodesModal from "@/components/modals/RevealedCodesModal";
import ThemeModal from "@/components/modals/ThemeModal";
import WalletExportModal from "@/components/modals/WalletExportModal";
import SettingsLinks from "@/components/settings/Link";
import ProfileHeader from "@/components/settings/ProfileHeader";
import AppearanceIcon from "@/components/svgs/appearance-icon";
import ExportIcon from "@/components/svgs/export-icon";
import NotificationIcon from "@/components/svgs/notification-icon";
import SecurityIcon from "@/components/svgs/security-icon";
import SignOutIcon from "@/components/svgs/sign-out";
import useAuth from "@/hooks/auth/useAuth";
import { router } from "expo-router";
import { View } from "react-native";

const Settings: FunctionComponent = () => {
  const [showAppearanceModal, setShowAppearanceModal] =
    useState<boolean>(false);
  const [showExportWalletModal, setShowExportWalletModal] =
    useState<boolean>(false);
  const [showRevealedCodesModal, setShowRevealCodesModal] =
    useState<boolean>(false);
  const { logoutUser } = useAuth();

  const settingsLinks = [
    {
      title: "Appearance",
      onPress: () => setShowAppearanceModal(true),
      icon: <AppearanceIcon />,
    },
    {
      title: "Notification",
      onPress: () => router.navigate("/(settings)/notification"),
      icon: <NotificationIcon />,
    },
    {
      title: "Security",
      onPress: () => router.navigate("/(settings)/security"),
      icon: <SecurityIcon />,
    },
    {
      title: "Export wallet",
      onPress: () => setShowExportWalletModal(true),
      icon: <ExportIcon />,
    },
    {
      title: "Sign out",
      onPress: logoutUser,
      icon: <SignOutIcon />,
    },
  ];
  return (
    <AppLayout>
      <View className="flex-1">
        <ProfileHeader
          walletAddress={"0x742d35Cc6634C0532925a3b844Bc454e4438f44e"}
        />
        <View className="mt-12">
          {settingsLinks.map((item) => (
            <View className="mb-8" key={item.title}>
              <SettingsLinks {...item} />
            </View>
          ))}
        </View>
        <ThemeModal
          isVisible={showAppearanceModal}
          onClose={() => setShowAppearanceModal((prev) => !prev)}
        />
        <WalletExportModal
          isVisible={showExportWalletModal}
          onClose={() => setShowExportWalletModal(false)}
          onRevealBtnPressed={() => {
            setShowExportWalletModal(false);
            setTimeout(() => {
              setShowRevealCodesModal(true);
            }, 1500);
          }}
        />
        <RevealCodesModal
          isVisible={showRevealedCodesModal}
          onClose={() => setShowRevealCodesModal(false)}
          onDone={() => {}}
        />
      </View>
    </AppLayout>
  );
};

export default Settings;
