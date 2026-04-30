import {
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";
import React, {
  ReactElement,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StatusBarStyle } from "react-native/Libraries/Components/StatusBar/StatusBar";
import { StyledKeyboardAwareScrollView } from "../StyledComponents";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { useSelector } from "@/app/store/Store";
import { useThemeColors } from "@/hooks/useThemeColor";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

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
  canGoBack?: boolean;
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
      horizontalPadding = true,
      bottomPadding = true,
      scrollable = true,
      showVerticalScrollIndicator = false,
      bounces = false,
      directChild = false,
      canGoBack = false,
    }: AppLayoutProps,
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    const { wp, isLargeScreen } = useAppDimensions();
    const containerRef = useRef<KeyboardAwareScrollView>(null);
    const { appTheme } = useSelector(["appTheme"]);
    const colors = useThemeColors();
    const phoneTheme = useColorScheme();

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

    const appBarStyle = useMemo(() => {
      const effectiveTheme = appTheme === "system" ? phoneTheme : appTheme;
      return effectiveTheme === "dark" ? "light" : "dark"; // expo-status-bar style values
    }, [appTheme, phoneTheme]);

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: statusBarBackgroundColor ?? colors.background,
          paddingTop: 5,
        }}
      >
        <StatusBar
          animated
          style={appBarStyle}
          backgroundColor={statusBarBackgroundColor ?? colors.background}
          hidden={false}
        />

        <View
          className={`flex-grow flex-1 w-full  ${layoutClassName}`}
          style={[{ backgroundColor: colors.background }, layoutStyle]}
        >
          <View className="mx-4">
            {canGoBack && (
              <TouchableOpacity onPress={() => router.back()}>
                <ChevronLeft color={colors.text} size={30} />
              </TouchableOpacity>
            )}
          </View>
          {scrollable ? (
            <View className={`flex-1 w-full ${outerContainerClassName}`}>
              <StyledKeyboardAwareScrollView
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
              </StyledKeyboardAwareScrollView>
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
  },
);

export default AppLayout;
