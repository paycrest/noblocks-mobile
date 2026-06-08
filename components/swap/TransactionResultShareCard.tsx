import { ResponsiveUi } from "@/components/ResponsiveUi";
import HeartIcon from "@/components/svgs/heart-icon";
import WarpcastIcon from "@/components/svgs/warpcast-icon";
import XIcon from "@/components/svgs/x-icon";
import { useThemeColors } from "@/hooks/useThemeColor";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const TransactionResultShareCard: React.FC = () => {
  const colors = useThemeColors();

  return (
    <View style={{ gap: 16 }}>
      <ResponsiveUi.Text fontSize={14} color={colors.secondary} style={{ lineHeight: 20 }}>
        Help spread the word
      </ResponsiveUi.Text>

      <View
        style={{
          backgroundColor: colors.neutral_surface,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 10,
            paddingVertical: 4,
          }}
        >
          <HeartIcon width={35} height={35} />
          <ResponsiveUi.Text
            fontSize={14}
            color={colors.secondary}
            style={{ flex: 1, lineHeight: 20 }}
          >
            Yay! I just sent crypto to a bank account in 12 sec on noblocks.xyz
          </ResponsiveUi.Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.subtle_surface,
            borderRadius: 360,
            paddingHorizontal: 12,
            paddingVertical: 6,
            gap: 4,
          }}
        >
          <XIcon color={colors.text} width={16} height={16} />
          <ResponsiveUi.Text medium fontSize={14} color={colors.text} style={{ lineHeight: 24 }}>
            X (Twitter)
          </ResponsiveUi.Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.subtle_surface,
            borderRadius: 360,
            paddingHorizontal: 12,
            paddingVertical: 6,
            gap: 4,
          }}
        >
          <WarpcastIcon color={colors.text} width={16} height={16} />
          <ResponsiveUi.Text medium fontSize={14} color={colors.text} style={{ lineHeight: 24 }}>
            Warpcast
          </ResponsiveUi.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransactionResultShareCard;
