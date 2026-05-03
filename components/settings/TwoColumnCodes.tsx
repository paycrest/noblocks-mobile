import React from "react";
import { View } from "react-native";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { ResponsiveUi } from "../ResponsiveUi";
import VerticalLineIcon from "../svgs/vertical-line-icon";
import { useTheme } from "react-native-paper";
import { useThemeColors } from "@/hooks/useThemeColor";

export default function TwoColumnCodes({ codes }: { codes: string[] }) {
  const { hp, wp } = useAppDimensions();
  // Split codes into two halves
  const mid = Math.ceil(codes.length / 2);
  const left = codes.slice(0, mid);
  const right = codes.slice(mid);
  const colors = useThemeColors();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: colors.background,
        padding: wp(4),
        borderRadius: wp(3),
        alignItems: "center",
        marginTop: hp(2),
      }}
    >
      {/* Left column */}
      <View style={{ width: "33%" }}>
        {left.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: hp(1.2),
            }}
          >
            <ResponsiveUi.Text small>{index + 1}</ResponsiveUi.Text>
            <ResponsiveUi.Text style={{ marginLeft: wp(2) }} small>
              {item}
            </ResponsiveUi.Text>
          </View>
        ))}
      </View>

      {/* Vertical divider as a component */}
      <View>
        <VerticalLineIcon />
      </View>

      {/* Right column */}
      <View style={{ width: "33%" }}>
        {right.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: hp(1.2),
            }}
          >
            <ResponsiveUi.Text small>{mid + index + 1}</ResponsiveUi.Text>
            <ResponsiveUi.Text style={{ marginLeft: wp(2) }} small>
              {item}
            </ResponsiveUi.Text>
          </View>
        ))}
      </View>
    </View>
  );
}
