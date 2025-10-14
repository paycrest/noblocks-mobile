import React, { FunctionComponent, useState } from "react";

import { Colors } from "@/constants/Colors";
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
    color: Colors.yellow,
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
          height: hp(65),
          position: "absolute",
          width: wp(95),
          bottom: 10,
          borderRadius: 40,
          backgroundColor: colors.surface_overlay,
          padding: 20,
          marginHorizontal: 40,
          marginBottom: 20,
          alignSelf: "center",
        }}
      >
        <View className="flex flex-row items-center justify-between">
          <ExportWalletIcon />
          <X onPress={onClose} size={20} color={colors.secondary} />
        </View>
        <View className="mt-8">
          <ResponsiveUi.Text semiBold>Export Wallet</ResponsiveUi.Text>
        </View>
        <View className="mt-8">
          {instructions.map((instruction, index) => (
            <View key={index} className="flex-row items-center mb-5">
              <View className="mr-4 bg-gray items-center justify-center rounded-full py-1 px-2.5">
                <ResponsiveUi.Text small color={instruction.color} key={index}>
                  {index + 1}
                </ResponsiveUi.Text>
              </View>
              <ResponsiveUi.Text tailwind="w-72" small>
                {instruction.text}
              </ResponsiveUi.Text>
            </View>
          ))}
        </View>
        <View className="flex-row py-4 mt-2 bg-gray rounded-md px-2 justify-between">
          <Check
            checked={isTermsAccepted}
            type="square"
            onPress={() => setIsTermsAccepted((prev) => !prev)}
          />
          <ResponsiveUi.Text tailwind="w-72 ml-5" fontSize={14}>
            I understand and accept the above information
          </ResponsiveUi.Text>
        </View>
        <ResponsiveUi.Button
          title="Reveal"
          className="mt-8"
          action={onRevealBtnPressed}
          disabled={!isTermsAccepted}
          iconMiddle={<RevealIcon />}
        />
      </View>
    </BaseModal>
  );
};

export default WalletExportModal;
