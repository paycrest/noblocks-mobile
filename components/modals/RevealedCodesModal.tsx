import { Copy, X } from "lucide-react-native";
import React, { FunctionComponent, useState } from "react";

import { useAppDimensions } from "@/hooks/useAppDimensions";
import { useThemeColors } from "@/hooks/useThemeColor";
import { View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";
import TwoColumnCodes from "../settings/TwoColumnCodes";
import ExportWalletIcon from "../svgs/export-wallet-icon";
import SecurityIcon from "../svgs/security-icon";
import BackdropBlur from "./BackdropBlur";
import BaseModal from "./BaseModal";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onDone: () => void;
}

const codes = [
  "donkey",
  "beast",
  "lyrics",
  "goat",
  "recipe",
  "fish",
  "neat",
  "trust",
  "rugged",
  "happy",
  "boring",
  "blanket",
];

const RevealCodesModal: FunctionComponent<Props> = ({
  isVisible,
  onClose,
  onDone,
}) => {
  const colors = useThemeColors();
  const { hp, wp } = useAppDimensions();
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  const rows = [
    codes.slice(0, Math.ceil(codes.length / 2)),
    codes.slice(Math.ceil(codes.length / 2)),
  ];
  return (
    <BaseModal isVisible={isVisible} onClose={onClose}>
      <BackdropBlur onClose={onClose} />
      <View
        style={{
          height: hp(78),
          position: "absolute",
          width: wp(95),
          bottom: 10,
          borderRadius: 40,
          backgroundColor: colors.surface_overlay,
          padding: 20,
          marginHorizontal: 40,
          marginBottom: 20,
          alignSelf: "center",
          borderWidth: 0.2,
          borderColor: colors.text,
        }}
      >
        <View className="flex flex-row items-center justify-between">
          <ExportWalletIcon />
          <X onPress={onClose} size={20} color={colors.secondary} />
        </View>
        <View className="mt-8">
          <ResponsiveUi.Text semiBold>Export Wallet</ResponsiveUi.Text>
        </View>
        <TwoColumnCodes codes={codes} />
        <ResponsiveUi.Button
          title="Copy codes"
          action={() => {}}
          className=" my-4"
          backgroundColor={colors.surface_overlay}
          iconMiddle={<Copy className="ml-4" color={colors.slate} />}
          color={colors.slate}
          containerStyle="mt-12"
        />
        <View className="flex-row py-4  bg-gray rounded-md px-2 justify-between">
          <SecurityIcon />
          <ResponsiveUi.Text tailwind="w-72 ml-5" fontSize={14}>
            I understand and accept the above information
          </ResponsiveUi.Text>
        </View>
        <ResponsiveUi.Button title="Done" className="mt-8" action={onDone} />
      </View>
    </BaseModal>
  );
};

export default RevealCodesModal;
