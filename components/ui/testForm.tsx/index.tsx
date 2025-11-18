import LiquidGlassButton from "@/components/LiquidGlassButton";
import { QAFormAnswerType, QAFormType } from "@/constants/QAForm";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, Dimensions, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUser from "@/hooks/use-user";

const ProgressBar = ({ progress, totalSteps }: { progress: number, totalSteps: number }) => {
    const [animatedWidth] = useState(new Animated.Value(0));
    const progressPercentage = (progress / totalSteps) * 100;

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progressPercentage,
            duration: 300, // 300ms 애니메이션
            useNativeDriver: false, // width는 native driver 사용 불가
        }).start();
    }, [progress, animatedWidth]);

    return (
        <View style={{ width: '100%', paddingHorizontal: 35, position: 'relative', paddingVertical: 22 }}>
            <View style={[progressBarStyle.view, progressBarStyle.viewBg]}>
                <Animated.View
                    style={[
                        progressBarStyle.filled,
                        {
                            width: animatedWidth.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%'],
                                extrapolate: 'clamp',
                            })
                        }
                    ]}
                />
            </View>
            <Text style={progressBarStyle.text}>{progress}/{totalSteps}</Text>
        </View>
    )
}

const TestStartScreen = ({ testDescription, testImage }: { testDescription: string, testImage: any }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 }}>
            <Image style={[test1_1_style.icon,]} resizeMode="cover" source={testImage} />
            <Text style={[test1_1_style.text, { paddingVertical: 20 }]}>
                {testDescription}
            </Text>
        </View>
    )
}

const TestChapterStartScreen = ({ chapterDescription, chapterImage, imageWidth, imageHeight }: { chapterDescription: string, chapterImage: any, imageWidth: number, imageHeight: number }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, gap: 30 }}>
            <Text style={test1_2_style.text}>
                {chapterDescription}
            </Text>
            <Image style={[test1_2_style.icon, { width: imageWidth, height: imageHeight }]} resizeMode="cover" source={chapterImage} />
        </View>
    )
}


const TestQuestionScreen = ({ question, answers, maxSelect, onChange }: {
    question: string,
    answers: QAFormAnswerType[],
    maxSelect: number | null,
    onChange: (index: number) => void
}) => {
    return (
        <View style={{ height: Dimensions.get('window').height * 0.9, overflow: 'visible', alignItems: 'center', paddingHorizontal: 34, gap: 0, paddingTop: 30 }}>
            <Text style={[test1_3_style.text, { height: 'auto' }]}>
                {question}
            </Text>
            <ScrollView style={test1_3_style.view} contentContainerStyle={{ gap: 17, paddingTop: 60, paddingBottom: 180 }}>
                {answers.map((answer, index) => {
                    const isSelected = answer.selected === true;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[test1_3_style.rectangleGroup]}
                            onPress={() => onChange(index)}
                        >
                            <View style={[test1_3_style.groupChild, { backgroundColor: isSelected ? '#FF2D55' : '#efeff0', overflow: 'hidden', paddingHorizontal: 20 }]}>
                                <Text style={[test1_3_style.textTypo, { color: isSelected ? '#fff' : '#999' }]}>{answer.answer}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export const TestForm = ({ form, setForm }:
    {
        form: QAFormType,
        setForm: (form: QAFormType) => void
    }) => {
    const { testType } = useLocalSearchParams();
    const { user } = useUser();

    const router = useRouter()
    const [step, setStep] = useState(1);
    const [currentChapter, setCurrentChapter] = useState<number>(1);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const totalStepCount = form.chapters.reduce((acc, section) => acc + section.questions.length, 0) + form.chapters.length + 1;

    const handleSelectForm = ({ section, questionId, answerIndex, maxSelect }:
        {
            section: number,
            questionId: string,
            answerIndex: number,
            maxSelect: number | null
        }) => {
        let _QAForm = [...form.chapters];

        let currentSectionIndex = _QAForm.findIndex(sectionItem => sectionItem.chapter === section);
        let currentQuestionIndex = _QAForm[currentSectionIndex]?.questions.findIndex(questionItem => questionItem.questionId === questionId);
        let currentAnswer = _QAForm[currentSectionIndex].questions[currentQuestionIndex].answers;

        // 현재 선택된 답변 개수 확인
        const selectedCount = currentAnswer.filter((answer: QAFormAnswerType) => answer.selected === true).length;
        const clickedAnswer = currentAnswer[answerIndex];
        const isCurrentlySelected = clickedAnswer.selected === true;

        // 다중 선택 로직
        if (isCurrentlySelected) {
            // 이미 선택된 답변이면 토글 (해제)
            currentAnswer = currentAnswer.map((answerItem: QAFormAnswerType, index: number) => 
                answerIndex === index 
                    ? { ...answerItem, selected: false } 
                    : answerItem
            );
        } else {
            // 선택되지 않은 답변이면
            if (maxSelect === null) {
                // 무제한 선택 가능
                currentAnswer = currentAnswer.map((answerItem: QAFormAnswerType, index: number) => 
                    answerIndex === index 
                        ? { ...answerItem, selected: true } 
                        : answerItem
                );
            } else if (maxSelect >= 2) {
                // 최대 선택 개수가 2 이상인 경우
                if (selectedCount < maxSelect) {
                    // 아직 선택 가능한 개수가 남아있으면 선택
                    currentAnswer = currentAnswer.map((answerItem: QAFormAnswerType, index: number) => 
                        answerIndex === index 
                            ? { ...answerItem, selected: true } 
                            : answerItem
                    );
                }
                // 선택 개수가 이미 maxSelect에 도달했으면 아무것도 하지 않음
            } else {
                // maxSelect가 1인 경우 (단일 선택)
                currentAnswer = currentAnswer.map((answerItem: QAFormAnswerType, index: number) => 
                    answerIndex === index 
                        ? { ...answerItem, selected: true } 
                        : { ...answerItem, selected: false }
                );
            }
        }

        _QAForm[currentSectionIndex].questions[currentQuestionIndex].answers = currentAnswer;

        setForm({ ...form, chapters: _QAForm });
    }

    const renderChapter = useMemo(() => {
        return currentQuestion === 0 ? (
            // 챕터 시작 페이지
            <TestChapterStartScreen
                chapterDescription={form.chapters[currentChapter - 1].chapterDescription}
                chapterImage={form.chapters[currentChapter - 1].chapterImage}
                imageWidth={form.chapters[currentChapter - 1].imageWidth}
                imageHeight={form.chapters[currentChapter - 1].imageHeight}
            />
        ) : (
            // 질문 페이지
            <TestQuestionScreen
                question={form.chapters[currentChapter - 1].questions[currentQuestion - 1].question}
                answers={form.chapters[currentChapter - 1].questions[currentQuestion - 1].answers}
                maxSelect={form.chapters[currentChapter - 1].questions[currentQuestion - 1].maxSelect}
                onChange={(index: number) => handleSelectForm({
                    section: currentChapter,
                    questionId: form.chapters[currentChapter - 1].questions[currentQuestion - 1].questionId,
                    answerIndex: index,
                    maxSelect: form.chapters[currentChapter - 1].questions[currentQuestion - 1].maxSelect
                })}
            />
        )
    }, [form.chapters, currentChapter, currentQuestion])

    // 현재 질문에서 선택된 답변이 있는지 확인
    const hasSelectedAnswer = useMemo(() => {
        // 테스트 시작 페이지나 챕터 시작 페이지에서는 항상 true
        if (step === 1 || currentQuestion === 0) {
            return true;
        }
        
        // 질문 페이지인 경우
        const currentAnswers = form.chapters[currentChapter - 1]?.questions[currentQuestion - 1]?.answers;
        if (!currentAnswers) return false;
        
        return currentAnswers.some((answer: QAFormAnswerType) => answer.selected === true);
    }, [form.chapters, currentChapter, currentQuestion, step]);

    const handlePrev = () => {
        if (step === 1) {
            // 첫 페이지에서는 이전 불가
            return;
        }
        
        if (currentQuestion === 0) {
            // 챕터 시작 페이지에서 이전
            if (currentChapter === 1) {
                // 첫 번째 챕터의 시작 페이지라면 테스트 시작 페이지로
                setStep(1);
            } else {
                // 이전 챕터의 마지막 질문으로
                const prevChapter = currentChapter - 1;
                const prevChapterQuestions = form.chapters[prevChapter - 1].questions.length;
                setCurrentChapter(prevChapter);
                setCurrentQuestion(prevChapterQuestions);
                setStep(prev => prev - 1);
            }
        } else {
            // 질문 페이지에서 이전
            if (currentQuestion === 1) {
                // 첫 번째 질문이면 챕터 시작 페이지로
                setCurrentQuestion(0);
                setStep(prev => prev - 1);
            } else {
                // 이전 질문으로
                setCurrentQuestion(currentQuestion - 1);
                setStep(prev => prev - 1);
            }
        }
    }

    const handleNext = async () => {
        if(!user) return;

        if (step === totalStepCount) {
            console.log('sending form', form)
            // AsyncStorage에 form 데이터 저장
            try {
                await AsyncStorage.setItem(`${user?.pk}_testFormData`, JSON.stringify(form));
                router.push({
                    pathname: '/test1Result',
                    params: {
                        testType: testType
                    }
                });
            } catch (error) {
                console.error('Form 데이터 저장 실패:', error);
            }
        } else {
            if (currentQuestion === form.chapters[currentChapter - 1].questions.length) {
                setCurrentChapter(currentChapter + 1);
                setCurrentQuestion(0);
                setStep(prev => prev + 1)
                console.log('다음 챕터로 이동')
            } else if (step > 1) {
                setCurrentQuestion(currentQuestion + 1);
                setStep(prev => prev + 1)
                console.log('다음 질문으로 이동')
            } else {
                setStep(prev => prev + 1)
                console.log('테스트 시작')
            }
        }
    }

    return (
        <SafeAreaView style={styles.safeareaview}>
            {step > 1 && <ProgressBar progress={step - 1} totalSteps={totalStepCount} />}
            <View style={styles.view}>
                {
                    // 테스트 시작 페이지
                    step === 1 ?
                        <TestStartScreen
                            testDescription={form.testDescription}
                            testImage={form.testImage}
                        />
                        : renderChapter
                }
                <View style={{ width: '100%', alignItems: 'center', position: 'absolute', bottom: 0, paddingBottom: 20, gap: 12, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20 }}>
                    {step > 1 && (
                        <LiquidGlassButton
                            text="이전으로"
                            backgroundColor="#b3b3b3"
                            onPress={handlePrev}
                            style={{ flex: 1, maxWidth: 160 }}
                        />
                    )}
                    <LiquidGlassButton
                        text={step === 1 ? "시작하기" : "다음"}
                        backgroundColor={hasSelectedAnswer ? "#FF5878" : "#d3d3d3"}
                        onPress={handleNext}
                        disabled={!hasSelectedAnswer}
                        style={step > 1 ? { flex: 1, maxWidth: 160 } : { width: 334 }}
                    />
                </View>
            </View>
        </SafeAreaView>);
};
const progressBarStyle = StyleSheet.create({
    track: {
        // flex: 1,
        backgroundColor: "rgba(120, 120, 128, 0.16)"
    },
    viewBg: {
        backgroundColor: "rgba(120, 120, 128, 0.16)",
        // flex: 1
    },
    view: {
        width: "100%",
        height: 4
    },
    filled: {
        position: "absolute",
        marginTop: -2,
        top: "50%",
        left: 0,
        borderRadius: 100,
        backgroundColor: "#FF2D55",
        height: 4,
        width: 0 // 초기값은 0, 애니메이션으로 조절됨
    },
    text: {
        width: 'auto',
        height: 17,
        fontSize: 14,
        fontWeight: "700",
        fontFamily: "Pretendard",
        color: "#b3b3b3",
        textAlign: "center",
        position: 'absolute',
        bottom: 0,
        right: 34
    }
})

const test1_1_style = StyleSheet.create({
    text: {
        // marginLeft: -160,
        // top: '50%',
        fontSize: 30,
        fontWeight: "700",
        fontFamily: "Pretendard",
        textAlign: "left",
        display: "flex",
        width: 320,
        minHeight: 111,
        alignItems: "center",
        color: "#000",
    },
    icon: {
        marginLeft: 'auto',
        width: 154,
        height: 114
    },
})

const test1_2_style = StyleSheet.create({
    text: {
        width: '100%',
        height: 'auto',
        fontSize: 30,
        fontWeight: "700",
        fontFamily: "Pretendard",
        color: "#000",
        textAlign: "left"
    },
    icon: {
        overflow: "hidden",
    },
})

const test1_3_style = StyleSheet.create({
    groupPosition: {
    },
    textTypo: {
        color: "#999",
        fontFamily: "Pretendard",
        fontWeight: "700",
        fontSize: 17,
    },
    view: {
        width: "100%",
    },
    rectangleParent: {
        width: "100%"
    },
    groupChild: {
        height: 59,
        borderRadius: 30,
        backgroundColor: "#efeff0",
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        width: '100%',
        fontSize: 30,
        fontWeight: "700",
        fontFamily: "Pretendard",
        color: "#000",
    },
    rectangleGroup: {
    },
})

const styles = StyleSheet.create({
    safeareaview: {
        backgroundColor: "#fff",
        flex: 1
    },
    iconPosition: {
        left: "50%",
        position: "absolute"
    },
    iconLayout: {
        height: 12,
        color: "#000"
    },
    view: {
        width: "100%",
        overflow: "hidden",
        height: 'auto',
        backgroundColor: "#fff",
        flex: 1
    },
    safeareaviewHomeIndicator: {
        marginLeft: 72,
        bottom: 8,
        backgroundColor: "rgba(128, 128, 128, 0.55)",
        width: 144,
        height: 5,
        transform: [
            {
                rotate: "180deg"
            }
        ],
        borderRadius: 100
    },
    statusBarIphone: {
        marginLeft: -201,
        width: 402,
        height: 50,
        paddingTop: 21,
        top: 0,
        backgroundColor: "#fff"
    },
    frame: {
        alignSelf: "stretch",
        justifyContent: "space-between",
        gap: 0,
        flexDirection: "row",
        alignItems: "center"
    },
    time: {
        paddingLeft: 16,
        paddingRight: 6,
        flexDirection: "row",
        flex: 1
    },
    safeareaviewTime: {
        lineHeight: 22,
        fontWeight: "600",
        color: "#000"
    },
    dynamicIslandSpacer: {
        height: 10,
        width: 124
    },
    levels: {
        paddingLeft: 6,
        paddingRight: 16,
        gap: 7,
        flexDirection: "row",
        flex: 1
    },
    cellularConnectionIcon: {
        width: 19
    },
    wifiIcon: {
        width: 17
    },
    battery: {
        height: 13,
        width: 27
    },
    border: {
        height: "100%",
        marginLeft: -13.65,
        top: "0%",
        bottom: "0%",
        borderRadius: 4,
        borderStyle: "solid",
        borderColor: "#000",
        borderWidth: 1,
        width: 25,
        opacity: 0.35
    },
    capIcon: {
        height: "31.54%",
        marginLeft: 12.35,
        top: "36.78%",
        bottom: "31.68%",
        maxHeight: "100%",
        width: 1,
        color: "#000"
    },
    capacity: {
        height: "69.23%",
        marginLeft: -11.65,
        top: "15.38%",
        bottom: "15.38%",
        borderRadius: 3,
        backgroundColor: "#000",
        width: 21
    }
});