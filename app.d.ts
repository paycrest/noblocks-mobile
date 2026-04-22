/// <reference types="nativewind/types" />

declare module "react-native-indicators" {
  import type { ComponentType } from "react";
  import type { EasingFunction, StyleProp, ViewStyle } from "react-native";

  export interface BaseIndicatorProps {
    animationEasing?: EasingFunction;
    animationDuration?: number;
    animating?: boolean;
    interaction?: boolean;
    style?: StyleProp<ViewStyle>;
    hidesWhenStopped?: boolean;
  }

  export interface UIActivityIndicatorProps extends BaseIndicatorProps {
    color?: string;
    count?: number;
    size?: number;
  }

  export interface SkypeIndicatorProps extends BaseIndicatorProps {
    color?: string;
    count?: number;
    size?: number;
    minScale?: number;
    maxScale?: number;
  }

  export interface WaveIndicatorProps extends BaseIndicatorProps {
    color?: string;
    count?: number;
    size?: number;
    waveFactor?: number;
    waveMode?: "fill" | "outline";
  }

  export const UIActivityIndicator: ComponentType<UIActivityIndicatorProps>;
  export const SkypeIndicator: ComponentType<SkypeIndicatorProps>;
  export const WaveIndicator: ComponentType<WaveIndicatorProps>;
}
