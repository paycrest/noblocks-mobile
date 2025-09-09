import React, {
  ReactElement,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  View,
  ViewStyle,
} from "react-native";

import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBarStyle } from "react-native/Libraries/Components/StatusBar/StatusBar";

interface AppLayoutProps {
  layoutStyle?: ViewStyle;
  containerStyle?: ViewStyle | ViewStyle[];
  layoutClassName?: string;
  containerClassName?: string;
  outerContainerClassName?: string;
  customHeader?: ReactElement;
  headerTitle?: string;
  onBackPress?: () => void;
  statusBarBackgroundColor?: string;
  barStyle?: StatusBarStyle;
  horizontalPadding?: boolean;
  bottomPadding?: boolean;
  actionBarBottomPadding?: boolean;
  showAddButton?: boolean;
  children?: any;
  addButtonAction?: () => void;
  scrollable?: boolean;
  showVerticalScrollIndicator?: boolean;
  showActionBar?: boolean;
  bounces?: boolean;
  directChild?: boolean;
}

export interface BookingContainerRef {
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

const AppLayout = forwardRef(
  (
    {
      children,
      layoutStyle,
      layoutClassName,
      containerClassName,
      outerContainerClassName,
      containerStyle,
      statusBarBackgroundColor,
      barStyle,
      horizontalPadding = true,
      bottomPadding = true,
      scrollable = true,
      showVerticalScrollIndicator = false,
      bounces = false,
      directChild = false,
    }: AppLayoutProps,
    ref
  ) => {
    const scheme = useAppColorScheme();
    const insets = useSafeAreaInsets();
    const { wp, isLargeScreen } = useAppDimensions();
    const containerRef = useRef<KeyboardAwareScrollView>(null);

    useImperativeHandle(ref, () => ({
      scrollToTop: (animated = true) => {
        containerRef?.current?.scrollToPosition(0, 0, animated);
      },
      scrollToBottom: (animated = true) => {
        containerRef?.current?.scrollToEnd(animated);
      },
      showOverlay: () => {},
      hideOverlay: () => {},
    }));

    return (
      <SafeAreaView className="flex-1 w-full">
        <View
          className={`flex-grow flex-1 pb-20 w-full  bg-blue dark:bg-dark-background ${layoutClassName}`}
          style={layoutStyle}
        >
          <StatusBar
            backgroundColor={
              statusBarBackgroundColor ? statusBarBackgroundColor : undefined
            }
            barStyle={
              barStyle
                ? barStyle
                : scheme === "dark"
                  ? "light-content"
                  : "dark-content"
            }
          />

          {scrollable ? (
            <View className={`flex-1 w-full ${outerContainerClassName}`}>
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                ref={containerRef}
                bounces={bounces}
                showsVerticalScrollIndicator={showVerticalScrollIndicator}
                contentContainerStyle={{
                  paddingBottom: bottomPadding ? wp(3) : 0,
                  flexGrow: 1,
                  paddingHorizontal: horizontalPadding ? 16 : 0,
                  paddingTop: 14,
                }}
              >
                {children}
                {bottomPadding && (
                  <View
                    style={{
                      height: Platform.select({
                        ios:
                          insets.bottom === 0
                            ? wp(5)
                            : isLargeScreen
                              ? insets.bottom + wp(2)
                              : insets.bottom * 0.8,
                        default: wp(3),
                      }),
                    }}
                  />
                )}
              </KeyboardAwareScrollView>
            </View>
          ) : directChild ? (
            children
          ) : (
            <View
              className={`flex-1 ${
                horizontalPadding ? "px-4 md:px-6" : ""
              } ${containerClassName}`}
              style={containerStyle}
            >
              {children}
              {bottomPadding && (
                <View
                  style={{
                    height: Platform.select({
                      ios:
                        insets.bottom === 0
                          ? wp(5)
                          : isLargeScreen
                            ? insets.bottom + wp(2)
                            : insets.bottom * 0.8,
                      default: wp(3),
                    }),
                  }}
                />
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
);

export default AppLayout;
