import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/Home";
import { Quiz } from "../screens/Quiz";
import { Finish } from "../screens/Finish";
import { History } from "../screens/History";

const { Navigator, Screen, Group } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Screen name="home" component={Home} />

      <Screen name="history" component={History} />

      <Group
        screenOptions={{
          gestureEnabled: false,
        }}
      >
        <Screen name="finish" component={Finish} />

        <Screen name="quiz" component={Quiz} />
      </Group>
    </Navigator>
  );
}
