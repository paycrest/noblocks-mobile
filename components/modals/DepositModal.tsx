import React, { FunctionComponent } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import BaseModal from "./BaseModal";
import BackdropBlur from "./BackdropBlur";
import { ResponsiveUi } from "../ResponsiveUi";
import { Copy, X } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import QRCodeIcon from "../svgs/qr-code";

const DepositModal: FunctionComponent<{
  isVisible: boolean;
  onClose: () => void;
  address: string;
}> = ({ isVisible, onClose, address }) => {
  const colors = useThemeColors();
  const MODAL_HEIGHT = Dimensions.get("screen").height * 0.7;
  return (
    <BaseModal isVisible={isVisible} onClose={onClose}>
      <>
        <BackdropBlur onClose={onClose} />
        <View className="flex-1 items-end justify-end mb-8 px-4">
          <View
            style={{
              width: "100%",
              height: MODAL_HEIGHT,
              borderRadius: 36,
              backgroundColor: colors.surface_overlay,
              borderWidth: 0.5,
              borderColor: colors.secondary,
              paddingHorizontal: 18,
              paddingTop: 22,
              paddingBottom: 14,
            }}
          >
            <View className="flex-row items-center justify-between mb-5">
              <ResponsiveUi.Text semiBold fontSize={20}>
                Deposit
              </ResponsiveUi.Text>
              <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
                <X size={28} color={colors.secondary} />
              </TouchableOpacity>
            </View>
            <View>
              <QRCodeIcon />
            </View>
            <View className="mt-8 flex-row justify-between mx-6 items-center">
              <ResponsiveUi.Text medium fontSize={16} color={colors.secondary}>
                Address
              </ResponsiveUi.Text>
              <ResponsiveUi.Text medium fontSize={16} className="mt-4">
                {address}
              </ResponsiveUi.Text>
            </View>
            <View>
              <ResponsiveUi.Text
                fontSize={14}
                color={colors.secondary}
                tailwind="mx-6 mt-6"
              >
                Scan the QR code or copy the address to receive your funds.
              </ResponsiveUi.Text>
            </View>
            <ResponsiveUi.Button
              title="Copy codes"
              action={() => {}}
              className="mt-8 bg-primary "
              iconMiddle={<Copy className="ml-4" color={colors.white} />}
              color={colors.white}
            />
          </View>
        </View>
      </>
    </BaseModal>
  );
};

export default DepositModal;
