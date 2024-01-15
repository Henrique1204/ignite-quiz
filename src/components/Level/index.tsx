import React from "react";

import { Pressable, PressableProps } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

import { THEME } from "../../styles/theme";
import { styles } from "./styles";

const TYPE_COLORS = {
  EASY: THEME.COLORS.BRAND_LIGHT,
  HARD: THEME.COLORS.DANGER_LIGHT,
  MEDIUM: THEME.COLORS.WARNING_LIGHT,
};

type Props = PressableProps & {
  title: string;
  isChecked?: boolean;
  type?: keyof typeof TYPE_COLORS;
};

const Wrapper = () => {
  return;
};

export function Level({
  title,
  type = "EASY",
  isChecked = false,
  ...rest
}: Props) {
  const COLOR = TYPE_COLORS[type];

  const scale = useSharedValue(1);
  const checked = useSharedValue(1);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      checked.value,
      [0, 1],
      ["transparent", COLOR]
    ),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    color: interpolateColor(
      checked.value,
      [0, 1],
      [COLOR, THEME.COLORS.GREY_100]
    ),
  }));

  const handleOnPresIn = () => {
    scale.value = withTiming(1.1, { duration: 300 });
  };

  const handleOnPresOut = () => {
    scale.value = withTiming(1, { duration: 300 });
  };

  React.useEffect(() => {
    checked.value = withTiming(isChecked ? 1 : 0);
  }, [isChecked]);

  return (
    <Pressable
      onPressIn={handleOnPresIn}
      onPressOut={handleOnPresOut}
      {...rest}
    >
      <Animated.View
        style={[
          styles.container,
          animatedContainerStyle,
          {
            borderColor: COLOR,
          },
        ]}
      >
        <Animated.Text style={[styles.title, animatedTextStyle]}>
          {title}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}
