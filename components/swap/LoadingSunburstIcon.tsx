import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

interface LoadingSunburstIconProps {
  color: string;
  size?: number;
}

const SEGMENT_COUNT = 8;

const LoadingSunburstIcon: React.FC<LoadingSunburstIconProps> = ({
  color,
  size = 16,
}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
      rotation.setValue(0);
    };
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const segmentWidth = Math.max(2, size * 0.16);
  const segmentHeight = Math.max(4, size * 0.34);
  const orbitRadius = size * 0.22;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          width: size,
          height: size,
          transform: [{ rotate: spin }],
        }}
      >
        {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
          const angle = (360 / SEGMENT_COUNT) * index;

          return (
            <View
              key={`sunburst-segment-${index}`}
              style={{
                position: "absolute",
                left: size / 2 - segmentWidth / 2,
                top: size / 2 - segmentHeight / 2,
                width: segmentWidth,
                height: segmentHeight,
                borderRadius: segmentWidth,
                backgroundColor: color,
                transform: [
                  { rotate: `${angle}deg` },
                  { translateY: -orbitRadius },
                ],
              }}
            />
          );
        })}
      </Animated.View>
    </View>
  );
};

export default LoadingSunburstIcon;
