import { Image } from "expo-image";
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Animated, Modal, Pressable, Easing } from "react-native";
import { CustomText as Text } from '@/components/CustomText';
import { SafeAreaView } from "react-native-safe-area-context";
import HeartActiveIcon from '@/assets/images/heartActive.svg';
import HeartInactiveIcon from '@/assets/images/heartInactive.svg';
import BackArrowIcon from '@/assets/images/backArrow.svg';
import { useState, useRef, useEffect, useMemo } from "react";
import Locations from "@/constants/Locations";
import { useRouter } from "expo-router";
import Rating from "@/components/ui/Rating";
import UserDummy from "@/constants/UserDummy";
import LocationCard, { LOCATION_CARD_FONT_SIZE, LOCATION_CARD_MARKER_SIZE } from "@/components/ui/LocationCard";
import TypeSelect from "@/components/trip/TypeSelect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationDetailOverlay from "@/components/ui/LocationDetailOverlay";
import useUser from "@/hooks/use-user";

export default function Main() {
    const { user } = useUser();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('best');
    const [selectedLocationIndex, setSelectedLocationIndex] = useState<number | null>(null);
    const [cardLayout, setCardLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [showTripContent, setShowTripContent] = useState(false);
    const [keepExpandedCardVisible, setKeepExpandedCardVisible] = useState(false);
    const [tripType, setTripType] = useState<string | undefined>(undefined);
    const [loveType, setLoveType] = useState<string | undefined>(undefined);
    const [filteredLocationList, setFilteredLocationList] = useState<any[]>([]);

    useEffect(() => {
        if(!user) return;

        (async () => {
            const result = await AsyncStorage.getItem(`${user?.pk}_locationLikes`);
            if (!result) {
                AsyncStorage.setItem(`${user?.pk}_locationLikes`, JSON.stringify([]));
            }
        })()
    }, [user])

    useEffect(() => {
        if(!user) return;

        if (selectedTab === 'best') {
            setFilteredLocationList(Locations);
        } else {
            (async () => {
                let result: any = await AsyncStorage.getItem(`${user?.pk}_locationLikes`);
                if (result) {
                    result = JSON.parse(result);
                    setFilteredLocationList(Locations.filter((item: any) => result.includes(item.name)));
                }
            })()
        }
    }, [selectedTab, user])

    // 선택된 타입에 따라 필터링된 사용자 목록
    const filteredUsers = useMemo(() => {
        let users = UserDummy;

        if (tripType) {
            users = users.filter(user => user.tripType === tripType);
        }

        if (loveType) {
            users = users.filter(user => user.loveType === loveType);
        }

        return users;
    }, [tripType, loveType]);

    const animatedWidth = useRef(new Animated.Value(189)).current;
    const animatedHeight = useRef(new Animated.Value(261)).current;
    const animatedTop = useRef(new Animated.Value(0)).current;
    const animatedLeft = useRef(new Animated.Value(0)).current;
    const animatedOpacity = useRef(new Animated.Value(0)).current;
    const otherElementsOpacity = useRef(new Animated.Value(1)).current;
    const initialMarkerSize = LOCATION_CARD_MARKER_SIZE;
    const expandedMarkerSize = LOCATION_CARD_MARKER_SIZE;
    const initialTextFontSize = LOCATION_CARD_FONT_SIZE;
    const expandedTextFontSize = 24;
    const markerSize = useRef(new Animated.Value(initialMarkerSize)).current;
    const textFontSize = useRef(new Animated.Value(initialTextFontSize)).current;
    const heartOpacity = useRef(new Animated.Value(1)).current;
    const scrollY = useRef(new Animated.Value(0)).current;
    const cardRefs = useRef<{ [key: number]: View | null }>({});
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const overlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cardContainerWidth = (screenWidth - 54 - 15) / 2;

    useEffect(() => {
        return () => {
            if (overlayTimeoutRef.current) {
                clearTimeout(overlayTimeoutRef.current);
            }
        };
    }, []);

    const resetAnimationState = () => {
        // 기본 값으로 복구
        animatedOpacity.setValue(0);
        otherElementsOpacity.setValue(1);
        animatedWidth.setValue(189);
        animatedHeight.setValue(261);
        animatedTop.setValue(0);
        animatedLeft.setValue(0);
        markerSize.setValue(initialMarkerSize);
        textFontSize.setValue(initialTextFontSize);
        heartOpacity.setValue(1);
        scrollY.setValue(0);
        setSelectedLocationIndex(null);
        setCardLayout(null);
        setShowTripContent(false);
        setKeepExpandedCardVisible(false);
        if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
            overlayTimeoutRef.current = null;
        }
    };

    const handleCardPress = (index: number) => {
        const cardRef = cardRefs.current[index];
        if (!cardRef) return;

        cardRef.measureInWindow((x, y, width, height) => {
            setCardLayout({ x, y, width, height });
            setSelectedLocationIndex(index);
            setKeepExpandedCardVisible(false);
            if (overlayTimeoutRef.current) {
                clearTimeout(overlayTimeoutRef.current);
                overlayTimeoutRef.current = null;
            }
            let _selectedLocationIndex = index;

            // 애니메이션 초기값 설정
            animatedWidth.setValue(width);
            animatedHeight.setValue(height);
            animatedTop.setValue(y);
            animatedLeft.setValue(x);
            animatedOpacity.setValue(1);
            markerSize.setValue(initialMarkerSize);
            textFontSize.setValue(initialTextFontSize);
            heartOpacity.setValue(1);

            // 다른 요소들 opacity 1->0 애니메이션 (숨김)
            Animated.parallel([
                Animated.timing(otherElementsOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(heartOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // 첫 번째 애니메이션 완료 후, 카드를 상단 중앙으로 이동하고 크기 변경
                const targetWidth = screenWidth; // 100vw
                const targetHeight = 412;
                const targetTop = 0; // 최상단
                const targetLeft = 0; // 중앙정렬 (width가 100%이므로)

                Animated.parallel([
                    Animated.timing(animatedWidth, {
                        toValue: targetWidth,
                        duration: 1000,
                        easing: Easing.bezier(0.76, 0.14, 0.43, 1.01),
                        useNativeDriver: false, // width/height는 native driver 사용 불가
                    }),
                    Animated.timing(animatedHeight, {
                        toValue: targetHeight,
                        duration: 1000,
                        easing: Easing.bezier(0.76, 0.14, 0.43, 1.01),
                        useNativeDriver: false,
                    }),
                    Animated.timing(animatedTop, {
                        toValue: targetTop,
                        duration: 1000,
                        easing: Easing.bezier(0.76, 0.14, 0.43, 1.01),
                        useNativeDriver: false,
                    }),
                    Animated.timing(animatedLeft, {
                        toValue: targetLeft,
                        duration: 1000,
                        easing: Easing.bezier(0.76, 0.14, 0.43, 1.01),
                        useNativeDriver: false,
                    }),
                    Animated.timing(markerSize, {
                        toValue: expandedMarkerSize,
                        duration: 1000,
                        easing: Easing.bezier(0.76, 0.14, 0.43, 1.01),
                        useNativeDriver: false,
                    }),
                    Animated.timing(textFontSize, {
                        toValue: expandedTextFontSize,
                        duration: 1000,
                        easing: Easing.bezier(0.76, 0.14, 0.43, 1.01),
                        useNativeDriver: false,
                    }),
                ]).start(() => {
                    scrollY.setValue(0);
                    if (overlayTimeoutRef.current) {
                        clearTimeout(overlayTimeoutRef.current);
                    }
                    setKeepExpandedCardVisible(true);
                    // 모든 애니메이션 완료 후 trip 콘텐츠 표시 (라우팅 없이 같은 화면에서 처리)
                    setShowTripContent(true);
                    overlayTimeoutRef.current = setTimeout(() => {
                        setKeepExpandedCardVisible(false);
                        overlayTimeoutRef.current = null;
                    }, 120);
                });
            });
        });
    };

    const handleClose = () => {
        setSelectedLocationIndex(null);
        setCardLayout(null);
        setShowTripContent(false);
        animatedOpacity.setValue(0);
        otherElementsOpacity.setValue(1);
        scrollY.setValue(0);
        setKeepExpandedCardVisible(false);
        if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
            overlayTimeoutRef.current = null;
        }
    };

    return (
        <View style={{ position: 'relative', backgroundColor: '#fff', width: '100%', height: '100%' }}>
            <Animated.Image
                source={require('@/assets/images/mainBackground.png')}
                style={{ position: 'absolute', top: 0, width: Dimensions.get('window').width, height: Dimensions.get('window').height, opacity: otherElementsOpacity }}
            />
            <View style={styles.safeareaview}>
                <View style={styles.view}>
                    <View style={styles.child} />

                    {/* 로고 */}
                    <Animated.View style={{ opacity: otherElementsOpacity, marginTop: Dimensions.get('window').height < 700 ? -35 : 0 }}>
                        <>
                            <View style={{ position: 'absolute', top: 51, width: '100%', alignItems: 'center' }}>
                                <Image source={require('@/assets/images/blackLogo.png')} style={{ width: 49, height: 42 }} />
                            </View>
                            <View style={{ position: 'absolute', top: 93, width: '100%', alignItems: 'center' }}>
                                <Image source={require('@/assets/images/logoTitle.png')} style={{ width: 153, height: 35 }} contentFit="contain" />
                            </View>
                        </>
                    </Animated.View>

                    {/* 탭 */}
                    <Animated.View style={{ opacity: otherElementsOpacity, marginTop: Dimensions.get('window').height < 700 ? -35 : -10 }}>
                        <>
                            <View style={{ backgroundColor: '#F76480', width: 18, height: 18, position: 'absolute', top: 181, left: selectedTab === 'best' ? 60 : 174, borderRadius: 100 }} />
                            <TouchableOpacity onPress={() => setSelectedTab('best')}>
                                <Text style={[selectedTab !== 'best' ? styles.selectedTabText : styles.unselectedTabText, styles.best, styles.newTypo]}>Best</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedTab('personal')}>
                                <Text style={[selectedTab !== 'personal' ? styles.selectedTabText : styles.unselectedTabText, styles.new, styles.newTypo]}>Personal</Text>
                            </TouchableOpacity>
                        </>
                    </Animated.View>

                    {/* 여행지 카드 */}
                    <Animated.View style={{ width: '100%', position: 'absolute', bottom: Dimensions.get('window').height > 900 ? '34%' : Dimensions.get('window').height < 700 ? '15%' : '27%', height: 301, opacity: otherElementsOpacity }}>
                        <ScrollView
                            horizontal
                            style={{ width: '100%', height: 301, paddingLeft: 41, paddingVertical: 20, overflow: 'visible' }}
                            contentContainerStyle={{ gap: 30 }}
                            showsHorizontalScrollIndicator={false}
                        >
                            {filteredLocationList.length > 0 ?
                                filteredLocationList.map((item: any, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleCardPress(index)}
                                        activeOpacity={1}
                                    >
                                        <LocationCard
                                            ref={(ref) => { cardRefs.current[index] = ref; }}
                                            image={item.image}
                                            name={item.name}
                                        />
                                    </TouchableOpacity>
                                ))
                                :
                                <View style={{ width: '100%', height: 301, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ marginLeft: -30, color: '#999', fontSize: 13, fontWeight: '300' }}>좋아요 표시된 여행지가 없습니다.</Text>
                                </View>
                            }
                        </ScrollView>
                    </Animated.View>

                    {/* 테스트 버튼 */}
                    <Animated.View style={[styles.vectorIconContainer, { opacity: otherElementsOpacity, bottom: Dimensions.get('window').height < 700 ? -82 : -20 }]}>
                        <TouchableOpacity onPress={() => router.push(`/test1?testType=trip`)} style={[styles.vectorIconLayout, { marginRight: -25, position: 'relative', alignItems: 'center', justifyContent: 'center', gap: Dimensions.get('window').width * 0.02 }]}>
                            <Image source={require('@/assets/images/liquidButton.png')} style={[styles.vectorIcon, styles.vectorIconLayout, { position: 'absolute', top: 0, left: 0 }]} />
                            <Image source={require('@/assets/images/travelTest.png')} style={{ width: 74, height: 74 }} />
                            <Image source={require('@/assets/images/travelTestTitle.png')} style={{ width: Dimensions.get('window').width * 0.2, height: 17 }} contentFit="contain" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push(`/test2?testType=love`)} style={[styles.vectorIconLayout, { marginLeft: -25, position: 'relative', alignItems: 'center', justifyContent: 'center', gap: Dimensions.get('window').width * 0.02 }]}>
                            <Image source={require('@/assets/images/liquidButton.png')} style={[styles.vectorIcon, styles.vectorIconLayout, { position: 'absolute', top: 0, left: 0 }]} />
                            <Image source={require('@/assets/images/relationshipTest.png')} style={{ width: 78, height: 70 }} />
                            <Image source={require('@/assets/images/relationshipTestTitle.png')} style={{ width: Dimensions.get('window').width * 0.2, height: 17 }} contentFit="contain" />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>

            {/* 클릭된 카드의 absolute positioned 컴포넌트 */}
            {selectedLocationIndex !== null && cardLayout && (!showTripContent || keepExpandedCardVisible) && (
                <Animated.View
                    style={{
                        width: animatedWidth,
                        height: animatedHeight,
                        position: 'absolute',
                        top: animatedTop,
                        left: animatedLeft,
                        borderRadius: 24,
                        overflow: 'hidden',
                        zIndex: 1000,
                        opacity: animatedOpacity,
                    }}
                    pointerEvents="box-none"
                >
                    <Image
                        source={Locations[selectedLocationIndex].image}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        contentFit="cover"
                    />
                    <View style={{ position: 'absolute', bottom: 18, width: '100%', alignItems: 'center' }}>
                        <Animated.View
                            style={{
                                width: markerSize,
                                height: markerSize,
                            }}
                        >
                            <Image
                                source={require('@/assets/images/marker.png')}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="contain"
                            />
                        </Animated.View>
                        <Animated.Text
                            style={{
                                marginTop: 7,
                                fontSize: textFontSize,
                                fontWeight: 600,
                                color: '#FFF',
                            }}
                        >
                            {Locations[selectedLocationIndex].name}
                        </Animated.Text>
                    </View>
                </Animated.View>
            )}

            {/* Trip 콘텐츠 오버레이 - 애니메이션 완료 후 표시 */}
            {showTripContent && selectedLocationIndex !== null && (
                <LocationDetailOverlay
                    location={Locations[selectedLocationIndex]}
                    scrollY={scrollY}
                    onClose={() => {
                        setShowTripContent(false);
                        resetAnimationState();
                    }}
                                    tripType={tripType}
                                    loveType={loveType}
                                    setTripType={(tripType: string) => {
                                        console.log('tripType', tripType);
                                        setTripType(tripType);
                                    }}
                                    setLoveType={(loveType: string) => setLoveType(loveType)}
                    filteredUsers={filteredUsers}
                    cardContainerWidth={cardContainerWidth}
                />
                                        )}
        </View>
    )
}

const filterStyles = StyleSheet.create({
    viewPosition: {
        width: 175,
        left: "50%",
        top: 0,
        position: "absolute",
        height: 52
    },
    textTypo: {
        textAlign: "left",
        left: 12,
        position: "absolute"
    },
    view: {
        width: "100%",
        height: 52,
        marginTop: 17
    },
    view2: {
        marginLeft: -185
    },
    view3: {
        marginLeft: -87.5,
        boxShadow: "0px 4px 7.4px rgba(0, 0, 0, 0.25)",
        elevation: 7.4,
        borderRadius: 10,
        backgroundColor: "#fff"
    },
    text: {
        top: 26,
        fontSize: 14,
        color: "#000"
    },
    safeareaviewText: {
        top: 10,
        fontSize: 10,
        color: "#999",
        width: 43
    },
    adjustmentsoutlineIcon: {
        top: 13,
        left: 140,
        width: 25,
        height: 24,
        position: "absolute"
    },
    view4: {
        marginLeft: 10
    }
});

const styles = StyleSheet.create({
    safeareaview: {
        flex: 1,
        paddingTop: 15
    },
    itemLayout: {
        color: "#fff",
        height: 156,
        width: 402,
        position: "absolute"
    },
    itemLayout1: {
        borderRadius: 76,
        left: 0
    },
    newTypo: {
        textAlign: "left",
        fontWeight: "700",
        fontSize: 20,
        top: 203,
        position: "absolute"
    },
    rectangleViewLayout: {
        height: 53,
        borderRadius: 30
    },
    rectangleViewPosition: {
        width: 142,
        left: 41,
        top: 624,
        position: "absolute"
    },
    blurPosition: {
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        bottom: 21,
        top: 31,
        left: 26,
        right: 26,
        position: "absolute"
    },
    glassPosition: {
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        position: "absolute"
    },
    iconLayout: {
        maxHeight: "100%",
        maxWidth: "100%",
        position: "absolute",
    },
    safeareaviewPosition: {
        left: 213,
        width: 142,
        top: 624,
        position: "absolute"
    },
    vectorIconLayout: {
        width: Dimensions.get('window').width * 0.5,
        height: Dimensions.get('window').width * 0.5,
    },
    fill2Position: {
        borderRadius: 296,
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        position: "absolute"
    },
    menuBottomBarLayout: {
        height: 70,
        position: "absolute"
    },
    mapLayout: {
        height: 35,
        width: 35,
        top: 812,
        position: "absolute"
    },
    iconPosition1: {
        bottom: "12.36%",
        top: "12.5%",
        height: "75.14%",
        color: "#444",
        maxHeight: "100%",
        maxWidth: "100%",
        position: "absolute",
    },
    iconPosition: {
        bottom: "8.24%",
        top: "8.33%",
        height: "83.43%",
        maxHeight: "100%",
        maxWidth: "100%",
        position: "absolute",
    },
    tripTypo: {
        height: 14,
        fontWeight: "200",
        fontSize: 12,
        top: 847,
        width: 35,
        textAlign: "center",
        color: "#000",
        position: "absolute"
    },
    myTypo: {
        width: 43,
        height: 14,
        fontWeight: "200",
        fontSize: 12,
        top: 847,
        textAlign: "center",
        color: "#000",
        position: "absolute"
    },
    textTypo: {
        fontSize: 14,
        top: 731,
        textAlign: "center",
        color: "#000",
        fontWeight: "700",
        position: "absolute"
    },
    icon8Position: {
        height: 261,
        width: 189,
        top: 258,
        left: 41,
        position: "absolute"
    },
    tokyoJapanTypo: {
        fontWeight: "500",
        fontSize: 17,
        textAlign: "left",
        color: "#fff",
        position: "absolute"
    },
    icon10Position: {
        left: 260,
        height: 261,
        width: 189,
        top: 258,
        position: "absolute"
    },
    view: {
        width: "100%",
        height: Dimensions.get('window').height - 140,
    },
    child: {
        left: -153,
        backgroundColor: "#d9d9d9",
        width: 90,
        top: 0,
        position: "absolute",
        height: 874
    },
    item: {
        top: 598,
        borderRadius: 76,
        left: 0
    },
    inner: {
        top: 467,
        left: -279,
        borderRadius: 60
    },
    rectangleIcon: {
        top: 292,
        width: 201,
        height: 306,
        color: "#faf4f2",
        position: "absolute"
    },
    best: {
        left: 49,
        textShadowColor: "rgba(255, 255, 255, 0.5)",
        textShadowOffset: {
            width: 0,
            height: 2
        },
        textShadowRadius: 10,
        textAlign: "left",
        fontWeight: "700",
        fontSize: 20,
        top: 203
    },
    new: {
        left: 142,
        textAlign: "left",
        fontWeight: "700",
        fontSize: 20,
        top: 203
    },
    selectedTabText: {
        color: "#999",
    },
    unselectedTabText: {
        color: "#000",
    },
    rectangleView: {
        width: 142,
        left: 41,
        top: 624,
        position: "absolute",
        backgroundColor: "#faf4f2"
    },
    liquidGlassRegularMediu: {
        height: 142
    },
    shadow: {
        top: -26,
        right: -26,
        bottom: -26,
        left: -26,
        position: "absolute"
    },
    blur: {
        borderRadius: 34
    },
    fill: {
        backgroundColor: "#0f0f0f",
        borderRadius: 34
    },
    glassEffect: {
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderRadius: 34
    },
    menu: {
        top: 19,
        left: 355,
        width: 32,
        height: 32,
        position: "absolute",
        overflow: "hidden"
    },
    icon: {
        height: "50%",
        width: "75%",
        top: "25%",
        right: "12.5%",
        bottom: "25%",
        color: "#757575",
        left: "12.5%",
        maxWidth: "100%"
    },
    safeareaviewChild: {
        backgroundColor: "#f9f3f2",
        height: 53,
        borderRadius: 30
    },
    safeareaviewLiquidGlassRegularMediu: {
        height: 142
    },
    safeareaviewIcon: {
        height: "4.81%",
        width: "12.24%",
        top: "5.84%",
        right: "43.98%",
        bottom: "89.36%",
        left: "43.78%"
    },
    vectorIcon: {
        height: 142,
        color: "#f8f2f0",
    },
    vectorIconContainer: {
        width: '100%',
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    liquidGlassRegularSmall: {
        top: 181,
        width: 18,
        height: 18,
        left: 65,
        position: "absolute"
    },
    blur3: {
        top: 28,
        bottom: 24,
        borderRadius: 1000,
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        left: 26,
        right: 26,
        position: "absolute"
    },
    fill2: {
        backgroundColor: "#333"
    },
    glassEffect2: {
        backgroundColor: "rgba(0, 0, 0, 0)"
    },
    roamingLove: {
        marginLeft: -103,
        top: 93,
        fontSize: 32,
        textAlign: "center",
        left: "50%",
        color: "#000",
        fontWeight: "700",
        position: "absolute"
    },
    menuBottomBar: {
        top: 804,
        backgroundColor: "#efeff0",
        width: 403,
        left: -1
    },
    messageCircle: {
        left: 261,
        overflow: "hidden"
    },
    icon2: {
        color: "#444",
        right: "12.36%",
        width: "75.14%",
        left: "12.5%"
    },
    compass: {
        marginLeft: -17,
        left: "50%",
        overflow: "hidden"
    },
    icon3: {
        width: "83.43%",
        right: "8.24%",
        left: "8.33%",
        color: "#444"
    },
    map: {
        left: 107
    },
    icon4: {
        width: "91.71%",
        right: "4.12%",
        left: "4.17%",
        color: "#444"
    },
    home: {
        left: 30,
        overflow: "hidden"
    },
    icon5: {
        color: "#f86782",
        right: "12.36%",
        width: "75.14%",
        left: "12.5%"
    },
    safeareaviewHome: {
        left: 30
    },
    trip: {
        left: 107
    },
    explore: {
        marginLeft: -21,
        left: "50%"
    },
    chat: {
        left: 257
    },
    my: {
        left: 334
    },
    icon6: {
        top: 640,
        left: 75,
        width: 74,
        height: 74,
        position: "absolute"
    },
    text: {
        left: 65
    },
    safeareaviewText: {
        left: 236
    },
    user: {
        left: 338,
        overflow: "hidden"
    },
    icon7: {
        width: "66.57%",
        right: "16.76%",
        left: "16.67%",
        color: "#444"
    },
    chatgptImage2025113: {
        top: 645,
        left: 245,
        width: 78
    },
    icon8: {
        borderRadius: 23
    },
    blur4: {
        borderRadius: 24
    },
    glassEffect3: {
        backgroundColor: "rgba(255, 255, 255, 0.07)",
        borderRadius: 24
    },
    tokyoJapan: {
        top: 474,
        left: 87
    },
    heart: {
        top: 270,
        left: 190,
        width: 22,
        height: 22,
        position: "absolute",
        overflow: "hidden"
    },
    icon9: {
        height: "75.91%",
        width: "87.27%",
        top: "12.49%",
        right: "6.27%",
        bottom: "11.6%",
        left: "6.45%"
    },
    icon10: {
        borderRadius: 24
    },
    parisFrance: {
        top: 476,
        left: 312
    },
    mapPin: {
        top: 473,
        left: 281,
        width: 25,
        height: 25,
        position: "absolute",
        overflow: "hidden"
    },
    icon11: {
        height: "91.6%",
        width: "75.2%",
        top: "4.17%",
        right: "12.3%",
        bottom: "4.23%",
        color: "#f3f3f3",
        left: "12.5%",
        maxWidth: "100%"
    }
});
