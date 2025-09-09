import { Text, TextProps, TextStyle } from "react-native";

import MaskedView from "@react-native-masked-view/masked-view";
import React from "react";
import LinearGradient from "react-native-linear-gradient";

interface GradientTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const GradientText = ({ children, style, ...rest }: GradientTextProps) => {
  const gradientColors = [
    "#04FF44", // Green
    "#EAAB12", // Yellow
    "rgba(255, 107, 144, 0.6)", // Pink fade
    "#FF0087", // Bright Pink
    "#5189F9", // Blue
  ];

  return (
    <MaskedView
      maskElement={
        <Text style={style} {...rest}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 1, y: 1 }} // left
        end={{ x: 1, y: 0 }} // right (horizontal gradient)
        locations={[0, 0.5, 0.7, 0.9, 1]} // smooth transition stops
      >
        <Text
          style={[style, { opacity: 0, fontFamily: "font-inter-medium" }]}
          {...rest}
        >
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
