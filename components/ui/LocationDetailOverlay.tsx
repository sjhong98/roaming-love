import { Image, ImageSource } from "expo-image";
import { View, StyleSheet, Dimensions, TouchableOpacity, Animated } from "react-native";
import { CustomText as Text } from '@/components/CustomText';
import BackArrowIcon from '@/assets/images/backArrow.svg';
import HeartActiveIcon from '@/assets/images/heartActive.svg';
import HeartInactiveIcon from '@/assets/images/heartIcon.svg';
import Rating from "@/components/ui/Rating";
import TypeSelect from "@/components/trip/TypeSelect";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUser from "@/hooks/use-user";
import { router } from "expo-router";

type LocationItem = {
    name: string;
    image: ImageSource;
};

type UserItem = {
    nickname: string;
    introduction: string;
    favorite: string;
    image: ImageSource;
    backgroundColor: string;
    follow: string;
};

type LocationDetailOverlayProps = {
    location: LocationItem;
    scrollY: Animated.Value;
    onClose: () => void;
    tripType: string | undefined;
    loveType: string | undefined;
    setTripType: (tripType: string) => void;
    setLoveType: (loveType: string) => void;
    filteredUsers: UserItem[];
    cardContainerWidth: number;
};

export default function LocationDetailOverlay({
    location,
    scrollY,
    onClose,
    tripType,
    loveType,
    setTripType,
    setLoveType,
    filteredUsers,
    cardContainerWidth,
}: LocationDetailOverlayProps) {
    const { user } = useUser();

    const screenWidth = Dimensions.get('window').width;
    const headerMaxHeight = 412;
    const headerMinHeight = 138;
    const headerHeight = scrollY.interpolate({
        inputRange: [0, headerMaxHeight - headerMinHeight],
        outputRange: [headerMaxHeight, headerMinHeight],
        extrapolate: 'clamp',
    });

    const [like, setLike] = useState(false);

    useEffect(() => {
        const checkLike = async () => {
            if (!user) return;

            let result: any = await AsyncStorage.getItem(`${user?.pk}_locationLikes`);
            if (result) {
                result = JSON.parse(result);
            }
            if (result && result.includes(location.name)) {
                setLike(true);
            } else {
                setLike(false);
            }
        };

        // 즉시 한 번 실행
        checkLike();
    }, [location.name])

    const handleLike = async () => {
        if (!user) return;

        let result: any = await AsyncStorage.getItem(`${user?.pk}_locationLikes`);
        
        if (result) {
            result = JSON.parse(result);
            if (result.includes(location.name)) {
                result = result.filter((item: string) => item !== location.name);
            } else {
                result.push(location.name);
            }
            await AsyncStorage.setItem(`${user?.pk}_locationLikes`, JSON.stringify(result));
            setLike(!like)
        }
    }

    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2000,
            }}
        >
            {/* Sticky 헤더: 스크롤에 따라 412 -> 138로 축소 후 고정 */}
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: screenWidth,
                    height: headerHeight,
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                    overflow: 'hidden',
                    zIndex: 10,
                }}
            >
                <Image
                    source={location.image}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                />
                <View style={{ position: 'absolute', top: 60, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={onClose}>
                        <BackArrowIcon style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLike}>
                        {like ? <HeartActiveIcon style={{ width: 25, height: 25 }} /> : <HeartInactiveIcon style={{ width: 25, height: 25 }} />}
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 7, position: 'absolute', bottom: 18, width: '100%', alignItems: 'center' }}>
                    <View
                        style={{ width: 32, height: 32 }}
                    >
                        <Image
                            source={require('@/assets/images/marker.png')}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="contain"
                        />
                    </View>
                    <Text
                        style={{ fontSize: 24, fontWeight: 600, color: '#FFF' }}
                    >
                        {location.name}
                    </Text>
                </View>
            </Animated.View>

            {/* 본문 스크롤: 헤더 높이만큼 상단 패딩을 두어 콘텐츠가 헤더 아래에서 시작 */}
            <Animated.ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: headerMaxHeight }}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={{ minHeight: Dimensions.get('window').height * 2, position: 'relative' }}>
                    <View style={locationTopStyles.view}>
                        <Text style={locationTopStyles.text}>추천지수</Text>
                        <Rating rating={4} />
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 11, marginTop: 9 }}>
                        <Image source={require('@/assets/images/ad.png')} style={adBannerStyles.rectangleIcon} resizeMode="cover" />
                    </View>

                    <TypeSelect
                        tripType={tripType}
                        loveType={loveType}
                        setTripType={(tripType: string) => {
                            console.log('tripType', tripType);
                            setTripType(tripType);
                        }}
                        setLoveType={(loveType: string) => setLoveType(loveType)}
                    />

                    <View style={{ marginTop: 30, paddingHorizontal: 27, overflow: 'visible' }}>
                        <View style={userCardStyles.grid}>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((item: any, index) => (
                                    <View key={`${item.nickname}-${index}`} style={[userCardStyles.cardWrapper, { width: cardContainerWidth }]}>
                                        <View style={[userCardStyles.view]}>
                                            <View style={[userCardStyles.child, { backgroundColor: item.backgroundColor }]} />
                                            <View style={userCardStyles.view2}>
                                                <Text style={[userCardStyles.text, userCardStyles.textTypo]}>{item.nickname}</Text>
                                                <Text style={[userCardStyles.text2, userCardStyles.textTypo]}>{item.introduction}</Text>
                                            </View>
                                            <View style={userCardStyles.view3}>
                                                {/* <Text style={[userCardStyles.text3, userCardStyles.text3Typo]}>{item.favorite}</Text> */}
                                            </View>
                                            <Image source={item.image} style={userCardStyles.item} />
                                            <TouchableOpacity onPress={() => router.push(`/chatDetail?id=${item?.id}`)} style={[userCardStyles.view4, userCardStyles.view4Position]}>
                                                <View style={[userCardStyles.inner, userCardStyles.view4Position]} />
                                                <Text style={[userCardStyles.follow, userCardStyles.text3Typo]}>Small Talk</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={{ width: '100%', height: 200, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '300', color: '#444' }}>여행자가 없습니다.</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    );
}

const userCardStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    cardWrapper: {
        marginBottom: 15
    },
    textTypo: {
        textAlign: "left",
        color: "#000",
        fontSize: 14,
        width: 133,
        left: "50%",
        marginLeft: -66.5,
        position: "absolute"
    },
    text3Typo: {
        textAlign: "center",
        color: "#000",
        position: "absolute"
    },
    view4Position: {
        height: 29,
        width: 137,
        marginLeft: -68.5,
        left: "50%",
        position: "absolute"
    },
    view: {
        height: 232,
        width: "100%",
        flex: 1
    },
    child: {
        height: "100%",
        top: "0%",
        right: "0%",
        bottom: "0%",
        boxShadow: "0px 0px 18px rgba(0, 0, 0, 0.15)",
        elevation: 18,
        borderRadius: 20,
        left: "0%",
        position: "absolute",
        width: "100%"
    },
    view2: {
        top: 108,
        height: 37,
        width: 133,
        left: "50%",
        marginLeft: -66.5,
        position: "absolute"
    },
    text: {
        top: 0,
        fontWeight: "800"
    },
    text2: {
        top: 22
    },
    view3: {
        width: "35.93%",
        right: "31.74%",
        bottom: 49,
        left: "32.34%",
        height: 14,
        position: "absolute"
    },
    text3: {
        fontSize: 13,
        fontWeight: "300",
        bottom: 0,
        left: "0%"
    },
    item: {
        top: 17,
        left: 15,
        width: 76,
        height: 76,
        color: "#fff",
        position: "absolute"
    },
    view4: {
        bottom: 11
    },
    inner: {
        boxShadow: "0px 0px 10.2px #fff",
        elevation: 10.2,
        borderRadius: 15,
        backgroundColor: "#fff",
        bottom: 0
    },
    follow: {
        bottom: 7,
        fontWeight: "800",
        fontSize: 14,
        textAlign: "center",
        width: 137,
    }
});

const adBannerStyles = StyleSheet.create({
    rectangleIcon: {
        width: "100%",
        height: 72,
        maxWidth: "100%",
        overflow: "hidden",
        borderRadius: 10,
    }
});

const locationTopStyles = StyleSheet.create({
    safeareaview: {
        flex: 1
    },
    view: {
        width: "100%",
        height: 28,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginTop: 17.39,
        paddingHorizontal: 21.32,
        gap: 6
    },
    ratingStars: {
        width: 108,
        height: 28
    },
    text: {
        fontSize: 12,
        lineHeight: 22,
        fontWeight: "300",
        color: "#000",
        textAlign: "left"
    }
});

