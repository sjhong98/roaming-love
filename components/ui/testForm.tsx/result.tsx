import { Image, StyleSheet, Text, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { default as ReAnimated, interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";
import LiquidGlassButton from "@/components/LiquidGlassButton";
import { Chapter, QAFormType } from "@/constants/QAForm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUser from "@/hooks/use-user";
import supabase from "@/db";

const Result_Loading_Screen = () => {
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = () => {
            Animated.sequence([
                // 위로 40px 올라가기
                Animated.timing(translateY, {
                    toValue: -40,
                    duration: 800,
                    useNativeDriver: true,
                }),
                // 원래 위치로 내려오기
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // 애니메이션이 끝나면 다시 시작
                setTimeout(animate, 1000);
            });
        };

        animate();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <Text style={test1_result_1_style.text}>결과를 분석하고 있어요</Text>
            <View>
                <Image style={test1_result_1_style.upperIcon} resizeMode="cover" source={require('@/assets/images/test1_result_1_upper.png')} />
                <Animated.Image
                    style={[test1_result_1_style.lowerIcon, { transform: [{ translateY }] }]}
                    resizeMode="cover"
                    source={require('@/assets/images/test1_result_1_lower.png')}
                />
            </View>
        </View>
    )
}

const Result_Screen = ({ testType, type }: { testType: string, type: string }) => {
    const isDirectionX = false
    const DELAY = 600

    const [regularCardOpacity, setRegularCardOpacity] = useState(1);
    const [flippedCardOpacity, setFlippedCardOpacity] = useState(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [isFlipping, setIsFlipping] = useState<boolean>(false);

    useEffect(() => {
        setIsFlipping(true);
        setTimeout(() => setIsFlipping(false), DELAY);

        if (isFlipped) {
            setTimeout(() => {
                setRegularCardOpacity(0);
                setFlippedCardOpacity(1);
            }, DELAY / 2)
        } else {
            setTimeout(() => {
                setRegularCardOpacity(1);
                setFlippedCardOpacity(0);
            }, DELAY / 2)
        }
    }, [isFlipped]);

    const regularCardAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(Number(isFlipped), [0, 1], [0, 180]);
        const rotateValue = withTiming(`${spinValue}deg`, { duration: DELAY });

        return {
            transform: [
                isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
            ],
        };
    });

    const flippedCardAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(Number(isFlipped), [0, 1], [180, 360]);
        const rotateValue = withTiming(`${spinValue}deg`, { duration: DELAY });

        return {
            transform: [
                isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
            ],
        };
    });

    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            {/* <ReAnimated.Image style={[regularCardAnimatedStyle, { width: 267, height: 461, opacity: regularCardOpacity }]} source={require('@/assets/images/result_example.png')} />
            <ReAnimated.Image style={[flippedCardAnimatedStyle, { width: 267, height: 461, marginTop: -461, opacity: flippedCardOpacity }]} source={require('@/assets/images/result_example2.png')} /> */}
            <Text>{type}</Text>


            {testType === 'trip' ?
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'absolute', bottom: 0, flexDirection: 'row' }}>
                    <LiquidGlassButton
                        style={{ width: '40%' }}
                        text='뒷장보기'
                        backgroundColor="#FF5878"
                        onPress={() => {
                            if (isFlipping) return;
                            setIsFlipped(prev => !prev);
                        }}
                    />
                    <LiquidGlassButton
                        style={{ width: '40%' }}
                        text='다음 테스트'
                        backgroundColor="#FF5878"
                        onPress={() => {
                            router.push('/test2');
                        }}
                    />
                </View>
                :
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'absolute', bottom: 0, flexDirection: 'row', paddingHorizontal: 20 }}>
                    <LiquidGlassButton
                        style={{ width: '100%' }}
                        text='홈으로'
                        backgroundColor="#FF5878"
                        onPress={() => {
                            router.push('/(tabs)/main');
                        }}
                    />
                </View>
            }
        </View>
    )
}

export default function TestResult() {
    const { user } = useUser();
    const { testType } = useLocalSearchParams();

    const router = useRouter();

    const [step, setStep] = useState<number>(1);
    const [result, setResult] = useState<QAFormType | null>(null);
    const [type, setType] = useState<string | null>(null);

    useEffect(() => {
        if (step === 1)
            setTimeout(() => {
                setStep(prev => prev + 1);
            }, 3000);
    }, [])

    useEffect(() => {
        loadFormAndCalculate();
    }, [user])

    const loadFormAndCalculate = async () => {
        try {
            if(!user) return;

            // AsyncStorage에서 form 데이터 읽기
            const formData = await AsyncStorage.getItem(`${user?.pk}_testFormData`);

            if(testType === 'trip') {
                supabase.from('user').update({
                    trip_type: type
                }).eq('pk', user.pk);
            } else {
                supabase.from('user').update({
                    love_type: type
                }).eq('pk', user.pk);
            }

            if (!formData || !user) {
                // console.error('Form 데이터가 없습니다.');
                return;
            }

            console.log('loaded form data length:', formData.length);

            calculateResult(formData);

            // 사용 후 AsyncStorage에서 삭제 (선택사항)
            await AsyncStorage.removeItem(`${user?.pk}_testFormData`);
        } catch (error) {
            console.error('Form 데이터 로드 실패:', error);
        }
    }

    const calculateResult = (formString: string) => {
        if (!formString || formString.trim() === '') {
            console.log('Form 문자열이 비어있습니다.');
            return;
        }

        try {
            if(!user) return;
            
            let parsedForm: QAFormType = JSON.parse(formString);

            // 모든 질문의 선택된 답변들의 score를 합산
            parsedForm.chapters.forEach((chapter, chapterIndex) => {
                chapter.questions.forEach((question, questionIndex) => {
                    question.answers.forEach((answer, answerIndex) => {
                        // 여러 개 선택된 답변들 모두 반영
                        if (answer.selected === true) {
                            console.log('answer.type', answer.type)
                            console.log('parsedForm.resultTypes[answer.type]', parsedForm.resultTypes[answer.type])
                            console.log('answer', answer)

                            parsedForm.resultTypes[answer.type].score += answer.score;
                        }
                    })
                })
            })
            setResult(parsedForm);

            // 최고 점수를 가진 타입 찾기
            let maxScore = 0;
            let maxScoreType = ''
            Object.keys(parsedForm.resultTypes).forEach(type => {
                if(parsedForm.resultTypes[type]?.score === undefined) {
                    console.log('type', type, 'score is undefined');
                    return
                }
                const score = parsedForm.resultTypes[type]?.score;
                if (score > maxScore) {
                    maxScore = score;
                    maxScoreType = type;
                }
            })
            console.log('\n\n\n\n계산결과: ', maxScoreType)
            setType(maxScoreType)
            AsyncStorage.setItem(`${user?.pk}_` + testType as string + 'Type', maxScoreType);

            console.log('\n\n\n계산결과 : ', maxScoreType, '점수:', maxScore);
        } catch (error) {
            console.error('JSON 파싱 에러:', error);
            console.error('파싱 시도한 form 값:', formString);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4, backgroundColor: '#fff', position: 'relative' }}>
            {step === 1 ? <Result_Loading_Screen /> : <Result_Screen testType={testType as string || ''} type={type || ''} />}
        </SafeAreaView>
    )
}

const test1_result_1_style = StyleSheet.create({
    text: {
        width: 274,
        height: 36,
        fontSize: 30,
        fontWeight: "700",
        fontFamily: "Pretendard",
        color: "#000",
        textAlign: "center"
    },
    upperIcon: {
        zIndex: 2,
        width: 253,
        height: 75,
    },
    lowerIcon: {
        width: 253,
        height: 128,
        marginTop: -10,
    }
})