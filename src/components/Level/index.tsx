import React from "react";

import { Pressable, PressableProps, Text } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
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

export function Level({
  title,
  type = "EASY",
  isChecked = false,
  ...rest
}: Props) {
  const scale = useSharedValue(1);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const COLOR = TYPE_COLORS[type];

  const handleOnPresIn = () => {
    scale.value = withTiming(1.1, { duration: 300 });
  };

  const handleOnPresOut = () => {
    scale.value = withTiming(1, { duration: 300 });
  };

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
            backgroundColor: isChecked ? COLOR : "transparent",
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: isChecked ? THEME.COLORS.GREY_100 : COLOR },
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
