import { useWindowDimensions } from "react-native";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { BlurMask, Canvas, Rect } from "@shopify/react-native-skia";

import { THEME } from "../../styles/theme";
import { useEffect } from "react";

const STATUS = [
  "transparent",
  THEME.COLORS.BRAND_LIGHT,
  THEME.COLORS.DANGER_LIGHT,
];

export type STATUS_ENUM = 0 | 1 | 2;

type OverlayFeedbackProps = {
  status?: STATUS_ENUM;
};

export function OverlayFeedback({ status = 0 }: OverlayFeedbackProps) {
  const { height, width } = useWindowDimensions();

  const opacity = useSharedValue(0);

  const overlayAnimateStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 400, easing: Easing.bounce }),
      withTiming(0)
    );
  }, [status]);

  return (
    <Animated.View style={[{ height, width, position: "absolute" }, overlayAnimateStyle]}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height} color={STATUS[status]}>
          <BlurMask blur={50} style="inner" />
        </Rect>
      </Canvas>
    </Animated.View>
  );
}
