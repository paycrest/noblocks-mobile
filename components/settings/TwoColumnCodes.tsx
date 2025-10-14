import React from "react";
import { View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";
import VerticalLineIcon from "../svgs/vertical-line-icon";

export default function TwoColumnCodes({ codes }: { codes: string[] }) {
  // Split codes into two halves
  const mid = Math.ceil(codes.length / 2);
  const left = codes.slice(0, mid);
  const right = codes.slice(mid);

  return (
    <View className=" flex-row justify-between w-full bg-gray p-4 rounded-lg items-center mt-6">
      {/* Left column */}
      <View className="w-1/3 ">
        {left.map((item, index) => (
          <View key={index} className="flex-row items-center mb-5">
            <ResponsiveUi.Text small>{index + 1}</ResponsiveUi.Text>
            <ResponsiveUi.Text tailwind="ml-3" small>
              {item}
            </ResponsiveUi.Text>
          </View>
        ))}
      </View>

      {/* Vertical divider as a component */}
      <View className="">
        <VerticalLineIcon />
      </View>

      {/* Right column */}
      <View className="w-1/3">
        {right.map((item, index) => (
          <View key={index} className="flex-row items-center mb-5">
            <ResponsiveUi.Text small>{mid + index + 1}</ResponsiveUi.Text>
            <ResponsiveUi.Text tailwind="ml-3" small>
              {item}
            </ResponsiveUi.Text>
          </View>
        ))}
      </View>
    </View>
  );
}
