import BaseSheet from "@/components/modals/BottomSheet";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import {
  RESULT_CONTENT_MAX_WIDTH,
  RESULT_CTA_GAP,
  RESULT_CTA_HEIGHT,
  RESULT_CTA_RADIUS,
  RESULT_HEADER_BAND_HEIGHT,
  RESULT_HEADER_BAND_RADIUS,
  RESULT_SECTION_GAP,
  RESULT_SHEET_PADDING_HORIZONTAL,
  RESULT_SHEET_TOP_RADIUS,
} from "@/components/swap/transactionResultConstants";
import { useThemeColors } from "@/hooks/useThemeColor";
import { X } from "lucide-react-native";
import React, { ReactNode } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TransactionResultLayoutProps {
  headerBandColor: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
  footer: ReactNode;
  onClose: () => void;
}

const TransactionResultLayout: React.FC<TransactionResultLayoutProps> = ({
  headerBandColor,
  icon,
  title,
  children,
  footer,
  onClose,
}) => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: colors.canvas_background,
          position: "absolute",
          left: 0,
          right: 0,
          top: -insets.top,
          bottom: 0,
        }}
      />

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: insets.top + 3,
          height: RESULT_HEADER_BAND_HEIGHT,
          backgroundColor: headerBandColor,
          borderRadius: RESULT_HEADER_BAND_RADIUS,
        }}
      />

      <BaseSheet
        isVisible
        snapPoints={["92%"]}
        topCornerRadius={RESULT_SHEET_TOP_RADIUS}
        backgroundColor={colors.surface_canvas}
        borderColor={colors.subtle_surface}
        isDismissible={false}
        showBackdrop={false}
        hideHandle
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: RESULT_SHEET_PADDING_HORIZONTAL,
              paddingTop: 20,
              paddingBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                minHeight: 28,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <X size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "100%",
                maxWidth: RESULT_CONTENT_MAX_WIDTH,
                alignSelf: "center",
                marginTop: 26,
                gap: RESULT_SECTION_GAP,
              }}
            >
              {icon}

              <ResponsiveUi.Text
                medium
                fontSize={20}
                color={colors.text}
                style={{ lineHeight: 28 }}
              >
                {title}
              </ResponsiveUi.Text>

              {children}
            </View>
          </ScrollView>

          <View
            style={{
              paddingHorizontal: RESULT_SHEET_PADDING_HORIZONTAL,
              paddingBottom: Math.max(insets.bottom, 16),
              paddingTop: 8,
              gap: RESULT_CTA_GAP,
            }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: RESULT_CONTENT_MAX_WIDTH,
                alignSelf: "center",
              }}
            >
              {footer}
            </View>
          </View>
        </View>
      </BaseSheet>
    </View>
  );
};

export const resultPrimaryButtonStyle = {
  height: RESULT_CTA_HEIGHT,
  borderRadius: RESULT_CTA_RADIUS,
};

export default TransactionResultLayout;
