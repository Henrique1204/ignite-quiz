import { useEffect } from "react";

import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

import {
  Canvas,
  Skia,
  Path,
  useValue,
  runTiming,
  Circle,
  BlurMask,
} from "@shopify/react-native-skia";

import { styles } from "./styles";
import { THEME } from "../../styles/theme";

type Props = TouchableOpacityProps & {
  checked: boolean;
  title: string;
};

const CHECK_SIZE = 28;
const CHECK_SIZE_DOUBLE = CHECK_SIZE * 2;
const CHECK_STROKE = 2;
const RADIUS = (CHECK_SIZE - CHECK_STROKE) / 2;
const CENTER_CIRCLE_RADIUS = RADIUS / 2;

export function Option({ checked, title, ...rest }: Props) {
  const percentage = useValue(0);
  const centerCircle = useValue(0);

  const path = Skia.Path.Make();
  path.addCircle(CHECK_SIZE, CHECK_SIZE, RADIUS);

  useEffect(() => {
    if (checked) {
      runTiming(percentage, 1, { duration: 400 });
      runTiming(centerCircle, CENTER_CIRCLE_RADIUS, { duration: 400 });
    }
    else {
      runTiming(percentage, 0, { duration: 400 });
      runTiming(centerCircle, 0, { duration: 400 });
    }
  }, [checked]);

  return (
    <TouchableOpacity
      style={[styles.container, checked && styles.checked]}
      {...rest}
    >
      <Text style={styles.title}>{title}</Text>

      <Canvas style={{ height: CHECK_SIZE_DOUBLE, width: CHECK_SIZE_DOUBLE }}>
        <Path
          path={path}
          color={THEME.COLORS.GREY_500}
          style="stroke"
          strokeWidth={CHECK_STROKE}
        />

        <Path
          path={path}
          color={THEME.COLORS.BRAND_LIGHT}
          style="stroke"
          strokeWidth={CHECK_STROKE}
          start={0}
          end={percentage}
        >
          <BlurMask blur={1} style="solid" />
        </Path>

        <Circle
          cx={CHECK_SIZE}
          cy={CHECK_SIZE}
          r={centerCircle}
          color={THEME.COLORS.BRAND_LIGHT}
        >
          <BlurMask blur={1} style="solid" />
        </Circle>
      </Canvas>
    </TouchableOpacity>
  );
}
