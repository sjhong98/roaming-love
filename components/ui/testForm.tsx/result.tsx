import { Image, StyleSheet, View, Animated, TouchableOpacity, Alert, Platform } from "react-native";
import { CustomText as Text } from '@/components/CustomText';
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { default as ReAnimated, interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";
import LiquidGlassButton from "@/components/LiquidGlassButton";
import { Chapter, QAFormType, Test1QAForm, Test2QAForm } from "@/constants/QAForm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUser from "@/hooks/use-user";
import supabase from "@/db";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';

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
    const [isSaving, setIsSaving] = useState<boolean>(false);

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

    const image1 = testType === 'trip' ? Test1QAForm.resultTypes[type]?.image1 : Test2QAForm.resultTypes[type]?.image1;
    const image2 = testType === 'trip' ? Test1QAForm.resultTypes[type]?.image2 : Test2QAForm.resultTypes[type]?.image2;

    const handleSaveImages = async () => {
        if (isSaving || !image1 || !image2) return;
        
        try {
            setIsSaving(true);
            
            // 권한 요청
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('권한 필요', '이미지를 저장하려면 미디어 라이브러리 접근 권한이 필요해요.');
                setIsSaving(false);
                return;
            }

            // 이미지 소스에서 실제 경로 가져오기
            const image1Source = Image.resolveAssetSource(image1);
            const image2Source = Image.resolveAssetSource(image2);

            if (!image1Source?.uri || !image2Source?.uri) {
                Alert.alert('오류', '이미지를 불러올 수 없습니다.');
                setIsSaving(false);
                return;
            }

            // 파일 이름 생성
            const timestamp = new Date().getTime();
            const fileName1 = `roaming_love_front_${timestamp}.png`;
            const fileName2 = `roaming_love_back_${timestamp}.png`;

            // 임시 디렉토리 경로 가져오기
            const tempDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
            if (!tempDir) {
                Alert.alert('오류', '파일 시스템에 접근할 수 없습니다.');
                setIsSaving(false);
                return;
            }

            const tempUri1 = `${tempDir}${fileName1}`;
            const tempUri2 = `${tempDir}${fileName2}`;

            // require로 로드된 이미지를 저장하기 위해
            // fetch로 이미지를 다운로드한 후 파일로 저장
            const response1 = await fetch(image1Source.uri);
            const arrayBuffer1 = await response1.arrayBuffer();
            const uint8Array1 = new Uint8Array(arrayBuffer1);
            
            // Uint8Array를 base64로 변환 (React Native 호환)
            let binary1 = '';
            const chunkSize = 8192;
            for (let i = 0; i < uint8Array1.length; i += chunkSize) {
                const chunk = uint8Array1.slice(i, i + chunkSize);
                binary1 += String.fromCharCode.apply(null, Array.from(chunk));
            }
            // base64 인코딩 (React Native에서는 직접 구현)
            const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            let base64Data1 = '';
            for (let i = 0; i < binary1.length; i += 3) {
                const a = binary1.charCodeAt(i);
                const b = i + 1 < binary1.length ? binary1.charCodeAt(i + 1) : 0;
                const c = i + 2 < binary1.length ? binary1.charCodeAt(i + 2) : 0;
                const bitmap = (a << 16) | (b << 8) | c;
                base64Data1 += base64Chars.charAt((bitmap >> 18) & 63);
                base64Data1 += base64Chars.charAt((bitmap >> 12) & 63);
                base64Data1 += i + 1 < binary1.length ? base64Chars.charAt((bitmap >> 6) & 63) : '=';
                base64Data1 += i + 2 < binary1.length ? base64Chars.charAt(bitmap & 63) : '=';
            }

            const response2 = await fetch(image2Source.uri);
            const arrayBuffer2 = await response2.arrayBuffer();
            const uint8Array2 = new Uint8Array(arrayBuffer2);
            
            let binary2 = '';
            for (let i = 0; i < uint8Array2.length; i += chunkSize) {
                const chunk = uint8Array2.slice(i, i + chunkSize);
                binary2 += String.fromCharCode.apply(null, Array.from(chunk));
            }
            let base64Data2 = '';
            for (let i = 0; i < binary2.length; i += 3) {
                const a = binary2.charCodeAt(i);
                const b = i + 1 < binary2.length ? binary2.charCodeAt(i + 1) : 0;
                const c = i + 2 < binary2.length ? binary2.charCodeAt(i + 2) : 0;
                const bitmap = (a << 16) | (b << 8) | c;
                base64Data2 += base64Chars.charAt((bitmap >> 18) & 63);
                base64Data2 += base64Chars.charAt((bitmap >> 12) & 63);
                base64Data2 += i + 1 < binary2.length ? base64Chars.charAt((bitmap >> 6) & 63) : '=';
                base64Data2 += i + 2 < binary2.length ? base64Chars.charAt(bitmap & 63) : '=';
            }

            // base64 데이터를 파일로 저장
            await FileSystem.writeAsStringAsync(tempUri1, base64Data1, {
                encoding: FileSystem.EncodingType.Base64,
            });

            await FileSystem.writeAsStringAsync(tempUri2, base64Data2, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // 갤러리에 저장
            await MediaLibrary.createAssetAsync(tempUri1);
            await MediaLibrary.createAssetAsync(tempUri2);

            Alert.alert('저장 완료', '테스트 결과가 갤러리에 저장되었습니다.');
        } catch (error) {
            console.error('이미지 저장 오류:', error);
            Alert.alert('오류', '이미지 저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!image1 || !image2) {
        return null;
    }

    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <ReAnimated.Image
                style={[regularCardAnimatedStyle, { width: testType === 'trip' ? 300 : 260, height: testType === 'trip' ? 589 : 519, opacity: regularCardOpacity }]}
                source={image1}
            />
            <ReAnimated.Image
                style={[flippedCardAnimatedStyle, { width: testType === 'trip' ? 300 : 260, height: testType === 'trip' ? 589 : 519, marginTop: testType === 'trip' ? -589 : -519, opacity: flippedCardOpacity }]}
                source={image2}
            />

            {/* 이미지 저장 버튼 */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: Platform.OS === 'ios' ? 50 : 20,
                    right: 20,
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}
                onPress={handleSaveImages}
                disabled={isSaving}
            >
                <Ionicons 
                    name="download-outline" 
                    size={24} 
                    color="#fff" 
                />
            </TouchableOpacity>


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
                            router.push('/test2?testType=love');
                        }}
                    />
                </View>
                :
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'absolute', bottom: 0, flexDirection: 'row', paddingHorizontal: 20 }}>
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
            if (!user) return;

            // AsyncStorage에서 form 데이터 읽기
            const formData = await AsyncStorage.getItem(`${user?.pk}_testFormData`);

            if (testType === 'trip') {
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
            if (!user) return;

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
                if (parsedForm.resultTypes[type]?.score === undefined) {
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
            // Alert.alert('계산결과: ' + maxScoreType + ' ' + user?.pk + ' ' + (testType as string));
            let _testType = testType as string;
            if (_testType === 'trip') {
                _testType = 'tripType';
            } else {
                _testType = 'loveType';
            }
            AsyncStorage.setItem(`${user?.pk}_` + _testType + 'Type', maxScoreType);

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
        width: 400,
        height: 36,
        fontSize: 30,
        fontWeight: "700",
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