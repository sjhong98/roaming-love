import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { default as ReAnimated, interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";
import LiquidGlassButton from "@/components/LiquidGlassButton";
import { Test1QAForm, Test2QAForm } from "@/constants/QAForm";

export default function ViewResult() {
    const { testType, type } = useLocalSearchParams<{ testType: string; type: string }>();
    
    const isDirectionX = false;
    const DELAY = 600;

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

    if (!testType || !type) {
        return null;
    }

    const isTrip = testType === 'trip';
    const cardWidth = isTrip ? 267 : 260;
    const cardHeight = isTrip ? 461 : 519;
    const image1 = isTrip ? Test1QAForm.resultTypes[type]?.image1 : Test2QAForm.resultTypes[type]?.image1;
    const image2 = isTrip ? Test1QAForm.resultTypes[type]?.image2 : Test2QAForm.resultTypes[type]?.image2;

    if (!image1 || !image2) {
        return null;
    }

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

