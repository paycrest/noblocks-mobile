import React, { ReactElement, memo } from "react";
import {
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";
import { useAppDimensions } from "../hooks/useAppDimensions";
import { cn } from "../utils/general";

export interface ResponsiveUiTextProps extends TextProps {
  // TEXT
  xl?: boolean;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  paragraph?: boolean;
  span?: boolean;
  small?: boolean;
  xs?: boolean;
  xxs?: boolean;
  fontSize?: number;
  lineHeight?: number;
  // TEXT COLOR
  textWhite?: boolean;
  darkText?: boolean;
  color?: string;
  link?: boolean;
  secondary?: boolean;
  danger?: boolean;
  // TEXT STYLE
  bold?: boolean;
  semiBold?: boolean;
  medium?: boolean;
  regular?: boolean;
  light?: boolean;
  italic?: boolean;
  robotoMedium?: boolean;
  center?: boolean;
  // CUSTOM TAILWIND
  tailwind?: string;
  // UTILS
  containerStyle?: string;
}

export interface ResponsiveUiButtonProps extends ResponsiveUiTextProps {
  title: string;
  iconLeft?: number | ReactElement | null;
  iconRight?: number | ReactElement;
  action: ((...args: any[]) => void) | undefined;
  style?: {};
  titleStyle?: TextStyle;
  backgroundColor?: string;
  disabled?: boolean;
  gradient?: boolean;
  colors?: string[];
  btnClassName?: string;
  loading?: boolean;
}

function processTailwindStyles(props: any) {
  return cn(
    "font-inter-regular",
    props.center && "text-center",
    // fonts
    props.bold && "font-inter-bold font-bold",
    props.semiBold && "font-inter-semi-bold font-semibold",
    props.medium && "font-inter-medium font-medium",
    props.regular && "font-inter-regular",
    props.light && "font-inter-light",
    // general
    props.tailwind && " " + props.tailwind
  );
}

const processTextStyles = (
  props: ResponsiveUiTextProps,
  fontPercentageToDP: any
): TextStyle | any => {
  const { colorScheme } = useColorScheme();

  return Object.assign(
    {
      fontSize: fontPercentageToDP(3.5),
    },
    props.color && {
      color: props.color,
    },
    !props.darkText &&
      !props.textWhite && {
        color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
      },
    // FONT SIZE
    props.fontSize && { fontSize: props.fontSize },
    props.xl && { fontSize: fontPercentageToDP(7) },
    props.h1 && { fontSize: fontPercentageToDP(6.5) },
    props.h2 && { fontSize: fontPercentageToDP(6) },
    props.h3 && { fontSize: fontPercentageToDP(5.5) },
    props.h4 && { fontSize: fontPercentageToDP(5) },
    props.h5 && { fontSize: fontPercentageToDP(4.5) },
    props.h6 && { fontSize: fontPercentageToDP(4) },
    props.paragraph && {
      fontSize: fontPercentageToDP(3.5),
    },
    props.span && {
      fontSize: fontPercentageToDP(3.2),
      lineHeight: fontPercentageToDP(5),
    },
    props.small && {
      fontSize: fontPercentageToDP(3),
      lineHeight: fontPercentageToDP(4.5),
    },
    props.xs && {
      fontSize: fontPercentageToDP(2.7),
      lineHeight: fontPercentageToDP(4),
    },
    props.xxs && {
      fontSize: fontPercentageToDP(2.5),
      lineHeight: fontPercentageToDP(3.5),
    },
    // LINE HEIGHT
    props.lineHeight && {
      lineHeight: fontPercentageToDP(props.lineHeight),
    },
    props?.style as any,
    // COLORS
    props.textWhite && styles.textWhite,
    props.darkText && styles.darkText,
    props.danger && styles.dangerText,
    props.secondary && {
      color:
        colorScheme === "dark" ? Colors.dark.secondary : Colors.light.secondary,
    },

    props.bold && { fontWeight: "700" },
    props.semiBold && { fontWeight: "600" },
    props.medium && { fontWeight: "500" },
    props.regular && { fontWeight: "400" },
    props.light && { fontWeight: "300" },
    props.italic && { fontStyle: "italic" }
  );
};

export const ResponsiveUi = {
  Text: memo((props: ResponsiveUiTextProps) => {
    const { fontPercentageToDP } = useAppDimensions();
    return (
      <Text
        allowFontScaling={false}
        {...props}
        className={processTailwindStyles(props)}
        style={processTextStyles(props, fontPercentageToDP)}
      >
        {props.children}
      </Text>
    );
  }),
  Button: memo(
    ({
      disabled = false,
      style,
      title,
      action,
      iconLeft,
      iconRight,
      backgroundColor,
      gradient = false,
      colors = [],
      btnClassName,
      ...rest
    }: ResponsiveUiButtonProps) => {
      return (
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={0.7}
          onPress={!disabled ? action : undefined}
          className={cn(btnClassName)}
          style={[
            style,
            backgroundColor && { backgroundColor },
            styles.responsiveBtn,
            {
              opacity: disabled ? 0.4 : 1,
            },
          ]}
        >
          <View className="justify-center items-center">
            {iconLeft && <View className="absolute left-4">{iconLeft}</View>}
            <ResponsiveUi.Text textWhite small semiBold={!rest?.bold} {...rest}>
              {title}
            </ResponsiveUi.Text>
            {iconRight && <View className="absolute right-4">{iconRight}</View>}
          </View>
        </TouchableOpacity>
      );
    }
  ),
  // other ui components can be added here like container, button etc.
};

const styles = StyleSheet.create({
  responsiveBtn: {
    borderRadius: 50,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.slate,
    width: "100%",
  },
  textWhite: {
    color: "white",
  },
  darkText: {
    color: Colors.dark.text,
  },
  dangerText: {
    color: Colors.destructive,
  },
});
