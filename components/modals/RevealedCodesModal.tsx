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
          height: Math.min(hp(86), 650),
          position: "absolute",
          width: wp(95),
          bottom: wp(2),
          borderRadius: wp(8),
          backgroundColor: colors.surface_overlay,
          padding: wp(5),
          marginHorizontal: wp(5),
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
        <View style={{ marginTop: hp(3) }}>
          <ResponsiveUi.Text semiBold fontSize={wp(5.2)}>
            Export Wallet
          </ResponsiveUi.Text>
        </View>
        <TwoColumnCodes codes={codes} />
        <ResponsiveUi.Button
          title="Copy codes"
          action={() => {}}
          style={{ marginVertical: hp(2) }}
          backgroundColor={colors.surface_overlay}
          iconMiddle={
            <Copy style={{ marginLeft: wp(2) }} color={colors.slate} />
          }
          color={colors.slate}
        />
        <View
          style={{
            flexDirection: "row",
            paddingVertical: hp(1.2),
            backgroundColor: colors.gray,
            borderRadius: wp(3),
            paddingHorizontal: wp(2),
            alignItems: "center",
            marginBottom: hp(2),
          }}
        >
          <SecurityIcon />
          <ResponsiveUi.Text
            style={{ width: wp(60), marginLeft: wp(4) }}
            fontSize={wp(3.5)}
          >
            I understand and accept the above information
          </ResponsiveUi.Text>
        </View>
        <ResponsiveUi.Button
          title="Done"
          style={{ marginTop: hp(3) }}
          action={onDone}
        />
      </View>
    </BaseModal>
  );
};

export default RevealCodesModal;
