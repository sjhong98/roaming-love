import { StyleSheet, View, TouchableOpacity, Alert, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { default as ReAnimated, interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";
import LiquidGlassButton from "@/components/LiquidGlassButton";
import { Test1QAForm, Test2QAForm } from "@/constants/QAForm";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';

export default function ViewResult() {
    const { testType, type } = useLocalSearchParams<{ testType: string; type: string }>();
    
    const isDirectionX = false;
    const DELAY = 600;

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

    if (!testType || !type) {
        return null;
    }

    const isTrip = testType === 'trip';
    const cardWidth = isTrip ? 300 : 260;
    const cardHeight = isTrip ? 590 : 519;
    const image1 = isTrip ? Test1QAForm.resultTypes[type]?.image1 : Test2QAForm.resultTypes[type]?.image1;
    const image2 = isTrip ? Test1QAForm.resultTypes[type]?.image2 : Test2QAForm.resultTypes[type]?.image2;

    if (!image1 || !image2) {
        return null;
    }

    const handleSaveImages = async () => {
        if (isSaving) return;
        
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

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <ReAnimated.Image
                    style={[regularCardAnimatedStyle, { width: cardWidth, height: cardHeight, opacity: regularCardOpacity }]}
                    source={image1}
                />
                <ReAnimated.Image
                    style={[flippedCardAnimatedStyle, { width: cardWidth, height: cardHeight, marginTop: -cardHeight, opacity: flippedCardOpacity }]}
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
                        text='돌아가기'
                        backgroundColor="#FF5878"
                        onPress={() => {
                            router.back();
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

