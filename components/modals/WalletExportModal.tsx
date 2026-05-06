import React, { FunctionComponent, useState } from "react";

import { genericColors } from "@/constants/Colors";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { useThemeColors } from "@/hooks/useThemeColor";
import { X } from "lucide-react-native";
import { View } from "react-native";
import Check from "../Check";
import { ResponsiveUi } from "../ResponsiveUi";
import ExportWalletIcon from "../svgs/export-wallet-icon";
import RevealIcon from "../svgs/reveal-icon";
import BackdropBlur from "./BackdropBlur";
import BaseModal from "./BaseModal";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onRevealBtnPressed: () => void;
}

interface Instructions {
  text: string;
  color: string;
}

const instructions: Instructions[] = [
  {
    text: "Never share your Secret Recovery Phrase with anyone.",
    color: genericColors.yellow,
  },
  {
    text: "Anyone who has access to your Secret Recovery Phrase can steal your funds.",
    color: "red",
  },
  {
    text: "Noblocks will never ask for your Secret Recovery Phrase.",
    color: "orange",
  },
  {
    text: "If you lose Secret Recovery Phrase, we can’t recover it for you.",
    color: "green",
  },
];

const WalletExportModal: FunctionComponent<Props> = ({
  isVisible,
  onClose,
  onRevealBtnPressed,
}) => {
  const colors = useThemeColors();
  const { hp, wp } = useAppDimensions();
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  return (
    <BaseModal isVisible={isVisible} onClose={onClose}>
      <BackdropBlur onClose={onClose} />
      <View
        style={{
          height: Math.min(hp(70), 550), // Cap max height for large screens
          position: "absolute",
          width: wp(95),
          bottom: wp(2), // Use smaller bottom margin for large screens
          borderRadius: wp(8),
          backgroundColor: colors.surface_overlay,
          padding: wp(5),
          marginHorizontal: wp(5),
          marginBottom: 20,
          alignSelf: "center",
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
        <View style={{ marginTop: hp(3) }}>
          {instructions.map((instruction, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: hp(2),
              }}
            >
              <View
                style={{
                  marginRight: wp(4),
                  backgroundColor: colors.gray,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 100,
                  paddingVertical: hp(0.7),
                  paddingHorizontal: wp(2.5),
                }}
              >
                <ResponsiveUi.Text small color={instruction.color} key={index}>
                  {index + 1}
                </ResponsiveUi.Text>
              </View>
              <ResponsiveUi.Text style={{ width: wp(60) }} small>
                {instruction.text}
              </ResponsiveUi.Text>
            </View>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: hp(1.2),
            marginTop: hp(1),
            backgroundColor: colors.gray,
            borderRadius: wp(3),
            paddingHorizontal: wp(2),
            alignItems: "center",
          }}
        >
          <Check
            checked={isTermsAccepted}
            type="square"
            onPress={() => setIsTermsAccepted((prev) => !prev)}
          />
          <ResponsiveUi.Text
            style={{ width: wp(50), marginLeft: wp(3) }}
            fontSize={wp(3.5)}
          >
            I understand and accept the above information
          </ResponsiveUi.Text>
        </View>
        <ResponsiveUi.Button
          title="Reveal"
          style={{ marginTop: hp(3) }}
          action={onRevealBtnPressed}
          disabled={!isTermsAccepted}
          iconMiddle={<RevealIcon />}
        />
      </View>
    </BaseModal>
  );
};

export default WalletExportModal;
