import React, { FunctionComponent, useCallback, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import Animated, { FadeIn } from "react-native-reanimated";

import { LegalFooter } from "@/components/LegalFooter";
import AppLayout from "@/components/layouts/AppLayout";
import OnboardingPageIndicator from "@/components/onboarding/OnboardingPageIndicator";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { ONBOARDING_SLIDES } from "@/lib/onboarding/slides";
import { router } from "expo-router";
import { useSelector } from "@/store/Store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Index: FunctionComponent = () => {
  const { setNewInstall } = useSelector(["setLaunchState", "setNewInstall"]);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = ONBOARDING_SLIDES[activeIndex];
  const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;

  const handleContinue = useCallback(() => {
    if (!isLastSlide) {
      const nextIndex = activeIndex + 1;
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
      return;
    }

    router.push("/(auth)/login");
    setNewInstall(false);
  }, [activeIndex, isLastSlide, setNewInstall]);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      setActiveIndex(nextIndex);
    },
    [width],
  );

  return (
    <AppLayout scrollable={false} bottomPadding>
      <View
        style={{
          flex: 1,
          paddingTop: Math.max(insets.top, 11),
        }}
      >
        <View style={{ paddingHorizontal: 22 }}>
          <OnboardingPageIndicator
            activeIndex={activeIndex}
            total={ONBOARDING_SLIDES.length}
          />
        </View>

        <FlatList
          ref={listRef}
          data={ONBOARDING_SLIDES}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={onMomentumScrollEnd}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          style={{ flexGrow: 0, marginTop: 8 }}
          renderItem={({ item }) => (
            <View
              style={{
                width,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 22,
                minHeight: 260,
              }}
            >
              {item.illustration.type === "image" ? (
                <Image
                  source={item.illustration.source}
                  style={{
                    width: item.illustration.width,
                    height: item.illustration.height,
                  }}
                  contentFit="contain"
                  accessibilityLabel="Noblocks onboarding illustration"
                />
              ) : (
                <item.illustration.Component width={340} height={197} />
              )}
            </View>
          )}
        />

        <Animated.View
          key={slide.id}
          entering={FadeIn.duration(240)}
          style={{
            width: "100%",
            maxWidth: 349,
            alignSelf: "center",
            paddingHorizontal: 22,
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 40,
              lineHeight: 37,
              color: "#FFFFFF",
            }}
          >
            {slide.titleLine1}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: "CrimsonPro_600SemiBold_Italic",
              fontStyle: "italic",
              fontSize: 52,
              lineHeight: 48,
              color: "#FFFFFF",
            }}
          >
            {slide.titleLine2}
          </Text>

          <Text
            allowFontScaling={false}
            style={{
              alignSelf: "center",
              marginTop: 20,
              width: 293,
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              lineHeight: 24,
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            {slide.body}
          </Text>

          <ResponsiveUi.Button
            title={isLastSlide ? "Continue" : "Next"}
            backgroundColor="#5D5DC9"
            fontSize={18}
            semiBold
            style={{
              width: 261,
              height: 52,
              borderRadius: 50,
              alignSelf: "center",
              marginTop: 20,
            }}
            btnClassName="self-center"
            action={handleContinue}
          />
        </Animated.View>

        <View
          style={{
            marginTop: 28,
            marginBottom: Math.max(insets.bottom, 16),
            alignSelf: "center",
            width: 233,
          }}
        >
          <LegalFooter lineHeight={16} />
        </View>
      </View>
    </AppLayout>
  );
};

export default Index;
