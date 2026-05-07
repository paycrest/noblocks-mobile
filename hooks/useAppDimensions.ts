import { useMemo } from "react";
import { Dimensions, PixelRatio, Platform } from "react-native";

const { width, height } = Dimensions.get("screen");

export const useAppDimensions = () => {
  const screenWidth = useMemo(() => {
    return Math.min(width, height);
  }, []);

  const scale = useMemo(() => {
    const isLargeScreen = screenWidth >= 768;
    return isLargeScreen ? screenWidth * 0.6 : screenWidth;
  }, [screenWidth]);

  const isLargeScreen = useMemo(() => {
    return screenWidth >= 768;
  }, [screenWidth]);

  const isSmallScreen = useMemo(() => {
    return screenWidth < 390;
  }, [screenWidth]);

  const widthPercentageToDP = (widthPercent: string | number) => {
    const elemWidth =
      typeof widthPercent === "number"
        ? widthPercent
        : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((scale * elemWidth) / 100);
  };

  const heightPercentageToDP = (heightPercent: string | number) => {
    const elemHeight =
      typeof heightPercent === "number"
        ? heightPercent
        : parseFloat(heightPercent);
    const screenHeight = Math.max(width, height);
    return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
  };

  const fontPercentageToDP = (widthPercent: string | number) => {
    const elemWidth =
      typeof widthPercent === "number"
        ? widthPercent
        : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(
      Platform.select({
        default: scale * elemWidth * (isLargeScreen ? 1 : 1.1),
        android: scale * elemWidth * 1.15,
      }) / 100,
    );
  };

  return {
    width: screenWidth,
    height: Math.max(width, height),
    wp: widthPercentageToDP,
    hp: heightPercentageToDP,
    fontPercentageToDP,
    isLargeScreen,
    isSmallScreen,
  };
};
