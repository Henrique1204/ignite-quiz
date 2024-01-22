import { useEffect, useRef, useState } from "react";

import { View, ScrollView, TouchableOpacity, Alert } from "react-native";

import { Swipeable } from "react-native-gesture-handler";

import Animated, {
  Layout,
  SlideInLeft,
  SlideInRight,
} from "react-native-reanimated";

import { useNavigation } from "@react-navigation/native";

import { HouseLine, Trash } from "phosphor-react-native";

import { Header } from "../../components/Header";
import { HistoryCard, HistoryProps } from "../../components/HistoryCard";
import { Loading } from "../../components/Loading";

import { historyGetAll, historyRemove } from "../../storage/quizHistoryStorage";

import { THEME } from "../../styles/theme";

import { styles } from "./styles";

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryProps[]>([]);

  const { goBack } = useNavigation();

  const swipeableRefs = useRef<Swipeable[]>([]);

  async function fetchHistory() {
    const response = await historyGetAll();
    setHistory(response);
    setIsLoading(false);
  }

  async function remove(id: string) {
    await historyRemove(id);

    fetchHistory();
  }

  const handleRemove = (id: string, refIndex?: number) => () => {
    const confirmAction = () => remove(id);

    const cancelAction = () => {
      if (refIndex !== undefined) swipeableRefs.current[refIndex].close();
    };

    Alert.alert("Remover", "Deseja remover esse registro?", [
      {
        text: "Sim",
        onPress: confirmAction,
      },
      {
        text: "Não",
        style: "cancel",
        onPress: cancelAction,
      },
    ]);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Histórico"
        subtitle={`Seu histórico de estudos${"\n"}realizados`}
        icon={HouseLine}
        onPress={goBack}
      />

      <ScrollView
        contentContainerStyle={styles.history}
        showsVerticalScrollIndicator={false}
      >
        {history.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={SlideInRight}
            exiting={SlideInLeft}
            layout={Layout.springify()}
          >
            <Swipeable
              ref={(ref) => ref && swipeableRefs.current.push(ref)}
              overshootLeft={false}
              containerStyle={styles.swipeableContainer}
              onSwipeableOpen={handleRemove(item.id, index)}
              renderRightActions={() => null}
              renderLeftActions={() => (
                <View style={styles.swipeableRemove}>
                  <Trash size={32} color={THEME.COLORS.GREY_100} />
                </View>
              )}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={handleRemove(item.id)}
              >
                <HistoryCard data={item} />
              </TouchableOpacity>
            </Swipeable>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}
