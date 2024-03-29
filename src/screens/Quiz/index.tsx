import { useEffect, useState } from "react";

import { Alert, Text, View, BackHandler } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import { useNavigation, useRoute } from "@react-navigation/native";

import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

import { styles } from "./styles";

import { QUIZ } from "../../data/quiz";
import { historyAdd } from "../../storage/quizHistoryStorage";

import { Loading } from "../../components/Loading";
import { Question } from "../../components/Question";
import { QuizHeader } from "../../components/QuizHeader";
import { ConfirmButton } from "../../components/ConfirmButton";
import { OutlineButton } from "../../components/OutlineButton";
import { ProgressBar } from "../../components/ProgressBar";
import { OverlayFeedback, STATUS_ENUM } from "../../components/OverlayFeedback";

import { THEME } from "../../styles/theme";

interface Params {
  id: string;
}

type QuizProps = (typeof QUIZ)[0];

const CARD_INCLINATION = 10;
const CARD_SKIP_AREA = -200;

export function Quiz() {
  const [points, setPoints] = useState(0);
  const [statusReply, setStatusReply] = useState<STATUS_ENUM>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quiz, setQuiz] = useState<QuizProps>({} as QuizProps);
  const [alternativeSelected, setAlternativeSelected] = useState<null | number>(
    null
  );

  const { navigate } = useNavigation();

  const route = useRoute();
  const { id } = route.params as Params;

  const shake = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const cardPosition = useSharedValue(0);

  const fixedProgressBarStyle = useAnimatedStyle(() => ({
    width: "110%",
    paddingTop: 60,
    backgroundColor: THEME.COLORS.GREY_500,
    position: "absolute",
    left: "-5%",
    zIndex: 1,
    opacity: interpolate(scrollY.value, [50, 80], [0, 1], Extrapolate.CLAMP),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [50, 100],
          [-40, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [60, 80], [1, 0], Extrapolate.CLAMP),
  }));

  const dragStyle = useAnimatedStyle(() => {
    const rotateZ = cardPosition.value / CARD_INCLINATION;

    return {
      transform: [
        { translateX: cardPosition.value },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  });

  const shakeStyleAnimated = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shake.value,
          [0, 0.5, 1, 1.5, 2, 2.5, 3],
          [0, -15, 0, 15, 0, -15, 0]
        ),
      },
    ],
  }));

  async function playSound(isCorrect: boolean) {
    const file = isCorrect
      ? require("../../assets/correct.mp3")
      : require("../../assets/wrong.mp3");

    const { sound } = await Audio.Sound.createAsync(file, { shouldPlay: true });

    await sound.setPositionAsync(0);
    await sound.playAsync();
  }

  function handleSkipConfirm() {
    Alert.alert("Pular", "Deseja realmente pular a questão?", [
      { text: "Sim", onPress: () => handleNextQuestion() },
      { text: "Não", onPress: () => {} },
    ]);
  }

  async function handleFinished() {
    await historyAdd({
      id: new Date().getTime().toString(),
      title: quiz.title,
      level: quiz.level,
      points,
      questions: quiz.questions.length,
    });

    navigate("finish", {
      points: String(points),
      total: String(quiz.questions.length),
    });
  }

  function handleNextQuestion() {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prevState) => prevState + 1);
    } else {
      handleFinished();
    }
  }

  async function shakeAnimation() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    shake.value = withSequence(
      withTiming(3, { duration: 400, easing: Easing.bounce }),
      withTiming(0, undefined, (finished) => {
        "worklet";
        if (finished) runOnJS(handleNextQuestion)();
      })
    );
  }

  async function handleConfirm() {
    if (alternativeSelected === null) {
      return handleSkipConfirm();
    }

    if (quiz.questions[currentQuestion].correct === alternativeSelected) {
      setPoints((prevState) => prevState + 1);

      await playSound(true);

      setStatusReply(1);
      handleNextQuestion();
    } else {
      await playSound(false);

      setStatusReply(2);
      shakeAnimation();
    }

    setAlternativeSelected(null);
  }

  function handleStop() {
    Alert.alert("Parar", "Deseja parar agora?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        style: "destructive",
        onPress: () => navigate("home"),
      },
    ]);

    return true;
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const onPan = Gesture.Pan()
    .activateAfterLongPress(200)
    .onUpdate((event) => {
      const movoToLeft = event.translationX < 0;

      if (movoToLeft) cardPosition.value = event.translationX;
    })
    .onEnd((event) => {
      cardPosition.value = withTiming(0);

      if (event.translationX < CARD_SKIP_AREA) runOnJS(handleSkipConfirm)();
    });

  useEffect(() => {
    const quizSelected = QUIZ.filter((item) => item.id === id)[0];
    setQuiz(quizSelected);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const backHandlerListenner = BackHandler.addEventListener(
      "hardwareBackPress",
      handleStop
    );

    return () => {
      backHandlerListenner.remove();
    };
  }, []);

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <OverlayFeedback status={statusReply} />

      <Animated.View style={fixedProgressBarStyle}>
        <Text style={styles.title}>{quiz.title}</Text>

        <ProgressBar
          total={quiz.questions.length}
          current={currentQuestion + 1}
        />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.question}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <QuizHeader
            title={quiz.title}
            currentQuestion={currentQuestion + 1}
            totalOfQuestions={quiz.questions.length}
          />
        </Animated.View>

        <GestureDetector gesture={onPan}>
          <Animated.View style={[shakeStyleAnimated, dragStyle]}>
            <Question
              key={quiz.questions[currentQuestion].title}
              question={quiz.questions[currentQuestion]}
              alternativeSelected={alternativeSelected}
              setAlternativeSelected={setAlternativeSelected}
              onUnmount={() => setStatusReply(0)}
            />
          </Animated.View>
        </GestureDetector>

        <View style={styles.footer}>
          <OutlineButton title="Parar" onPress={handleStop} />
          <ConfirmButton onPress={handleConfirm} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}
