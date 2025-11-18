import { forwardRef, useEffect, useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle, TouchableOpacity, Animated } from "react-native";
import { Image, ImageSource } from "expo-image";
import HeartActiveIcon from "@/assets/images/heartActive.svg";
import HeartInactiveIcon from "@/assets/images/heartIcon.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUser from "@/hooks/use-user";

export const LOCATION_CARD_MARKER_SIZE = 32;
export const LOCATION_CARD_FONT_SIZE = 18;

type LocationCardProps = {
    image: ImageSource;
    name: string;
    containerStyle?: StyleProp<ViewStyle>;
    showHeart?: boolean;
    markerSize?: number;
    titleFontSize?: number;
};

const LocationCard = forwardRef<View, LocationCardProps>(function LocationCard(
    {
        image,
        name,
        containerStyle,
        showHeart = true,
        markerSize = LOCATION_CARD_MARKER_SIZE,
        titleFontSize = LOCATION_CARD_FONT_SIZE,
    },
    ref
) {
    const { user } = useUser();

    const [like, setLike] = useState(false);
    const heartScale = useState(new Animated.Value(1))[0];


    useEffect(() => {
        const checkLike = async () => {
            if (!user) return;

            let result: any = await AsyncStorage.getItem(`${user?.pk}_locationLikes`);
            if (result) {
                result = JSON.parse(result);

                if (result.includes(name)) {
                    setLike(true);
                } else {
                    setLike(false);
                }
            } else {
                AsyncStorage.setItem(`${user?.pk}_locationLikes`, JSON.stringify([]));
            }
        };

        // 즉시 한 번 실행
        checkLike();

        // 3초마다 반복 실행
        const interval = setInterval(() => {
            checkLike();
        }, 1000);

        // cleanup: 컴포넌트 언마운트 시 interval 정리
        return () => {
            clearInterval(interval);
        };
    }, [name])

    const handleHeartPress = async () => {
        if (!user) return;

        // 팝 애니메이션 효과
        Animated.sequence([
            Animated.timing(heartScale, {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(heartScale, {
                toValue: 1,
                tension: 300,
                friction: 10,
                useNativeDriver: true,
            }),
        ]).start();

        const newLikeState = !like;
        setLike(newLikeState);

        let result: any = await AsyncStorage.getItem(`${user?.pk}_locationLikes`);

        if (result) {
            result = JSON.parse(result);
            if (result.includes(name)) {
                result = result.filter((item: string) => item !== name);
            } else {
                result.push(name);
            }
            await AsyncStorage.setItem(`${user?.pk}_locationLikes`, JSON.stringify(result));
        }
    };

    return (
        <View ref={ref} style={[styles.container, containerStyle]}>
            <Image source={image} style={styles.image} contentFit="cover" />
            {showHeart ? (
                <TouchableOpacity
                    onPress={handleHeartPress}
                    activeOpacity={1}
                    style={styles.heartContainer}
                >
                    <Animated.View
                        style={[
                            styles.heart,
                            {
                                transform: [{ scale: heartScale }],
                            },
                        ]}
                    >
                        {like ? <HeartActiveIcon style={styles.heartIcon} /> : <HeartInactiveIcon style={styles.heartIcon} />}
                    </Animated.View>
                </TouchableOpacity>
            ) : null}
            <View style={styles.bottomInfo}>
                <View style={{ width: markerSize, height: markerSize }}>
                    <Image
                        source={require("@/assets/images/marker.png")}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="contain"
                    />
                </View>
                <View style={{ width: '100%', alignItems: 'center', paddingHorizontal: 10 }}>
                    <Text
                        style={[
                            styles.name,
                            {
                                marginTop: 7,
                                fontSize: titleFontSize,
                            },
                        ]}
                    >
                        {name}
                    </Text>
                </View>
            </View>
        </View>
    );
});

export default LocationCard;

const styles = StyleSheet.create({
    container: {
        width: 189,
        height: 261,
        borderRadius: 24,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0px 8px 20px 5px rgba(0, 0, 0, 0.2)",
    },
    image: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    },
    heartContainer: {
        position: "absolute",
        top: 14,
        right: 19,
        width: 25,
        height: 25,
        zIndex: 10,
    },
    heart: {
        width: 25,
        height: 25,
    },
    heartIcon: {
        width: 25,
        height: 25,
    },
    bottomInfo: {
        position: "absolute",
        bottom: 18,
        width: "100%",
        alignItems: "center",
    },
    name: {
        fontWeight: "600",
        color: "#FFF",
    },
});

