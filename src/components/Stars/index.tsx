import { View } from "react-native";

import Animated, { BounceIn } from "react-native-reanimated";

import {
  Canvas,
  Easing,
  LinearGradient,
  Path,
  useLoop,
} from "@shopify/react-native-skia";

import TrophySvg from "../../assets/trophy.svg";

import { styles } from "./styles";
import { THEME } from "../../styles/theme";

export function Stars() {
  const backStarsBlinkAnimated = useLoop({
    duration: 2000,
    easing: Easing.ease,
  });

  const frontStarsBlinkAnimated = useLoop({
    duration: 3000,
    easing: Easing.bounce,
  });

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Path
          path="M232.405 231.922C232.005 231.922 231.648 231.666 231.52 231.287C229.729 225.979 228.387 224.638 223.079 222.846C222.7 222.718 222.444 222.362 222.444 221.961C222.444 221.561 222.7 221.204 223.079 221.076C228.388 219.285 229.729 217.943 231.52 212.635C231.648 212.255 232.004 212 232.405 212C232.806 212 233.162 212.255 233.29 212.635C235.082 217.943 236.423 219.284 241.731 221.076C242.11 221.204 242.366 221.561 242.366 221.961C242.366 222.362 242.11 222.718 241.731 222.846C236.423 224.638 235.082 225.979 233.29 231.287C233.162 231.666 232.806 231.922 232.405 231.922Z"
          opacity={frontStarsBlinkAnimated}
        >
          <LinearGradient
            colors={[THEME.COLORS.STAR_BLUE, THEME.COLORS.STAR_GREEN]}
            start={{ x: 222, y: 212 }}
            end={{ x: 238, y: 222 }}
          />
        </Path>

        <Path
          path="M49.6094 130.408C49.1066 130.408 48.6598 130.087 48.4992 129.611C46.2508 122.949 44.568 121.267 37.9066 119.019C37.4301 118.858 37.1094 118.411 37.1094 117.908C37.1094 117.405 37.4301 116.958 37.9063 116.798C44.5676 114.55 46.2504 112.867 48.4988 106.205C48.6598 105.729 49.1063 105.408 49.609 105.408C50.1117 105.408 50.5586 105.729 50.7191 106.205C52.9676 112.867 54.6504 114.55 61.3117 116.798C61.7879 116.959 62.109 117.405 62.109 117.908C62.109 118.411 61.7883 118.858 61.3117 119.019C54.6504 121.267 52.9676 122.949 50.7191 129.611C50.559 130.087 50.1121 130.408 49.6094 130.408Z"
          color={THEME.COLORS.STAR_GRAY}
          opacity={backStarsBlinkAnimated}
        />
      </Canvas>

      <Animated.View entering={BounceIn}>
        <TrophySvg />
      </Animated.View>
    </View>
  );
}
