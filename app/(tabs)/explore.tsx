import CommentIcon from '@/assets/images/commentIcon.svg';
import HeartInactiveIcon from '@/assets/images/heartIcon.svg';
import SearchRedIcon from '@/assets/images/searchRed.svg';
import supabase from "@/db";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Explore() {
    const scrollRef = useRef<ScrollView>(null);

    const [activeTab, setActiveTab] = useState('recommend');
    const [isCustomRefreshing, setIsCustomRefreshing] = useState(false);
    const [tabContainerWidth, setTabContainerWidth] = useState(0);
    const [postList, setPostList] = useState([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }]);
    const [isPulled, setIsPulled] = useState(false);
    const indicatorLeft = useRef(new Animated.Value(80)).current;
    const indicatorWidth = useRef(new Animated.Value(29)).current;
    const HEADER_HEIGHT = 120;
    const HEADER_HIDE_DISTANCE = HEADER_HEIGHT + 40;
    const scrollY = useRef(new Animated.Value(0)).current;
    const lastHeaderY = useRef(0);
    const pullDistance = useRef(new Animated.Value(0));
    const pullDistanceValue = useRef(0);
    const clampedScrollY = useRef(Animated.diffClamp(scrollY, 0, HEADER_HIDE_DISTANCE)).current;
    const headerTranslateY = clampedScrollY.interpolate({
        inputRange: [0, HEADER_HIDE_DISTANCE],
        outputRange: [0, -HEADER_HIDE_DISTANCE],
        extrapolate: 'clamp',
    });
    const refreshHeight = pullDistance.current.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 185],
        extrapolate: 'clamp'
    });
    const paddingTop = pullDistance.current.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 50],
        extrapolate: 'clamp'
    });
    const refreshOpacity = pullDistance.current.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    useEffect(() => {
        console.log('isPulled', isPulled);
    }, [isPulled]);

    useEffect(() => {
        if (!isCustomRefreshing) return;

        const timeout = setTimeout(() => {
            setIsCustomRefreshing(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [isCustomRefreshing]);

    useEffect(() => {
        const targetWidth = activeTab === 'recommend' ? 40 : 70;
        const targetLeft = activeTab === 'recommend'
            ? 75
            : Math.max(0, (tabContainerWidth || 0) - 73 - targetWidth);

        Animated.parallel([
            Animated.timing(indicatorLeft, {
                toValue: targetLeft,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(indicatorWidth, {
                toValue: targetWidth,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    }, [activeTab, indicatorLeft, indicatorWidth, tabContainerWidth]);

    const contentHeightRef = useRef(0);
    const containerHeightRef = useRef(0);
    const PULL_THRESHOLD = 80;

    const updatePullDistance = (value: number) => {
        pullDistance.current.setValue(value);
        pullDistanceValue.current = value;
        setIsPulled(value >= PULL_THRESHOLD || isCustomRefreshing);
    };

    useEffect(() => {
        console.log('isCustomRefreshing', isCustomRefreshing);
        if (isCustomRefreshing) {
            Animated.timing(pullDistance.current, {
                toValue: 135,
                duration: 220,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(pullDistance.current, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    }, [isCustomRefreshing]);

    useEffect(() => {
        if (isCustomRefreshing) {
            setIsPulled(true);
        } else if (pullDistanceValue.current < PULL_THRESHOLD) {
            setIsPulled(false);
        }
    }, [isCustomRefreshing]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        const maxScroll = Math.max(0, contentHeightRef.current - containerHeightRef.current);

        if (y < 0 && !isCustomRefreshing) {
            updatePullDistance(-y);
            return;
        }

        if (!isCustomRefreshing) {
            updatePullDistance(0);
        }
        if (maxScroll > 0 && y > maxScroll) return;

        if (isPulled) {
            lastHeaderY.current = lastHeaderY.current ?? 0;
            return;
        }

        lastHeaderY.current = y;
        scrollY.setValue(y);
    };

    const handleScrollEndDrag = () => {
        if (isCustomRefreshing) return;

        if (pullDistanceValue.current >= PULL_THRESHOLD) {
            setIsCustomRefreshing(true);
        } else {
            Animated.timing(pullDistance.current, {
                toValue: 0,
                duration: 180,
                useNativeDriver: false,
            }).start();
        }
    };


    return (
        <View style={{ flex: 1, position: 'relative' }}>

            <Animated.View style={{ paddingTop: 70, backgroundColor: '#fff', width: '100%', height: 140, zIndex: 1000, position: 'absolute', top: 0, left: 0, right: 0, transform: [{ translateY: headerTranslateY }], paddingBottom: 0 }}>
                <View style={topStyles.view0}>
                    <View style={{ position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={topStyles.text}>탐색하기</Text>
                        <TouchableOpacity onPress={() => { }} style={{ marginRight: -115, marginTop: -1 }}>
                            <SearchRedIcon width={24} height={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={tabStyles.view}>
                    <View style={tabStyles.child}>
                        <View
                            style={{ position: 'relative', width: '100%', height: 30, justifyContent: 'space-between', alignItems: 'center', marginTop: -30, flexDirection: 'row', paddingHorizontal: 80 }}
                            onLayout={(event) => setTabContainerWidth(event.nativeEvent.layout.width)}
                        >
                            <TouchableOpacity activeOpacity={1} onPress={() => setActiveTab('recommend')}>
                                <Text style={[tabStyles.text, tabStyles.textTypo]}>추천</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} onPress={() => setActiveTab('follow')}>
                                <Text style={[tabStyles.text2, tabStyles.textTypo]}>팔로우 중</Text>
                            </TouchableOpacity>
                            <Animated.View style={[tabStyles.item, { left: indicatorLeft, width: indicatorWidth }]} />
                        </View>
                    </View>
                </View>
            </Animated.View>

            {/* <SafeAreaView style={{ flex: 1 }}> */}
            <Animated.ScrollView
                ref={scrollRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 150, minHeight: Dimensions.get('window').height - 100, paddingTop: 135 }}
                scrollEventThrottle={16}
                onScroll={handleScroll}
                onScrollEndDrag={handleScrollEndDrag}
                onContentSizeChange={(_, height) => { contentHeightRef.current = height; }}
                onLayout={(event) => { containerHeightRef.current = event.nativeEvent.layout.height; }}
            >
                <Animated.View style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: refreshHeight,
                    opacity: refreshOpacity,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}>
                    <ActivityIndicator size="small" color="#FF2D55" />
                </Animated.View>
                <Animated.View style={{ width: '100%', height: paddingTop }} />
                {
                    postList.map((item, index) => (
                        <View key={index} style={{ width: '100%', minHeight: 95, position: 'relative', borderColor: "#b3b3b3", borderBottomWidth: 0.5, paddingTop: 10 }}>
                            <View key={index} style={postStyles.view}>
                                <View style={postStyles.child} />
                                <View style={[postStyles.view2, postStyles.itemPosition]}>
                                    {/* <Image source={{ uri: item.image }} style={[postStyles.item, postStyles.itemPosition]} resizeMode="cover" /> */}
                                    <Text style={[postStyles.text, postStyles.textTypo]}>닉네임</Text>
                                    <Text style={[postStyles.text2, postStyles.textTypo]}>안녕하세요! 졸업을 축하드립니다</Text>
                                </View>
                                <View style={postStyles.bookmarkParent}>
                                    <View style={[postStyles.heart, postStyles.heartLayout]}>
                                        <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 40 }}>
                                            <HeartInactiveIcon style={[postStyles.icon,]} />
                                            <Text style={{ fontSize: 12, fontWeight: '300', color: '#000', fontFamily: 'Pretendard', marginLeft: -4 }}>1000</Text>
                                        </View>
                                    </View>
                                    <View style={[postStyles.bookmark, postStyles.heartLayout]}>
                                        <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <CommentIcon style={[postStyles.icon2, { marginTop: -2 }]} />
                                            <Text style={{ fontSize: 12, fontWeight: '300', color: '#000', fontFamily: 'Pretendard', marginBottom: -1, marginLeft: -4 }}></Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                }
            </Animated.ScrollView>
            {/* </SafeAreaView> */}

            <TouchableOpacity onPress={() => router.push('/createPost')} style={{ position: 'absolute', bottom: 20, right: 10 }}>
                <Image source={require('@/assets/images/createPostIcon.png')} style={{ width: 90, height: 85, zIndex: 9999 }} />
            </TouchableOpacity>
        </View>
    );
}

const postStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    itemPosition: {
        height: 45,
        top: 0,
        position: "absolute"
    },
    textTypo: {
        textAlign: "left",
        color: "#000",
        fontFamily: "SF Pro",
        lineHeight: 22,
        left: 58,
        position: "absolute"
    },
    heartLayout: {
        // overflow: "hidden",
        width: 20,
        height: 20,
        top: 0,
        position: "absolute"
    },
    iconLayout: {
        color: "#1b1f26",
        maxHeight: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        position: "absolute"
    },
    view: {
        width: "100%",
    },
    child: {
        marginLeft: -201,
        top: 84,
        left: "50%",
        width: 402,
        height: 0,
        position: "absolute"
    },
    view2: {
        left: 21,
        width: 251
    },
    item: {
        width: 45,
        left: 0,
        borderRadius: 100
    },
    text: {
        fontSize: 15,
        fontWeight: "600",
        top: 0,
        textAlign: "left",
        color: "#000",
        fontFamily: "SF Pro",
        lineHeight: 22,
        left: 58
    },
    text2: {
        top: 23,
        fontSize: 14
    },
    bookmarkParent: {
        top: 54,
        left: 79,
        width: 305,
        height: 20,
        position: "absolute"
    },
    bookmark: {
        left: 60
    },
    icon: {
        width: 20,
        height: 20,
        color: "#1b1f26"
    },
    heart: {
        left: 0,
        top: -2
    },
    icon2: {
        height: "76%",
        width: "87%",
        top: "12.49%",
        right: "6.55%",
        bottom: "11.51%",
        left: "6.45%"
    },
    messageSquare: {
        left: 0
    },
    icon3: {
        width: "75%",
        right: "12.5%",
        left: "12.5%",
        bottom: "12.5%",
        top: "12.5%",
        height: "75%",
        color: "#1b1f26"
    },
    share: {
        left: 285
    },
    icon4: {
        height: "83.5%",
        width: "66.5%",
        top: "8.33%",
        right: "16.83%",
        bottom: "8.17%",
        left: "16.67%",
        color: "#5b5e63",
        maxHeight: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        position: "absolute"
    }
});

const tabStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    textTypo: {
        textAlign: "center",
        color: "#000",
        fontFamily: "NanumSquare Neo",
        fontWeight: "700",
        fontSize: 15,
        // top: 0,
        // position: "absolute"
    },
    view: {
        width: "100%",
        height: 30,
        marginTop: -10
        // flex: 1
    },
    child: {
        top: 30,
        borderStyle: "solid",
        borderColor: "#b3b3b3",
        borderBottomWidth: 0.5,
        width: '100%',
        height: 0,
        position: "absolute"
    },
    text: {
        // left: 84
    },
    text2: {
        // left: 275
    },
    item: {
        top: 26,
        borderRadius: 1,
        backgroundColor: "rgba(255, 45, 85, 0.7)",
        width: 29,
        height: 4,
        position: "absolute",
        // left: 80,
        // right: 80
    }
});


const topStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    textTypo1: {
        fontSize: 17,
        top: 37,
        textAlign: "center",
        fontFamily: "NanumSquare Neo OTF",
        fontWeight: "700",
        left: "50%",
        position: "absolute"
    },
    childPosition: {
        left: '6%',
        position: "absolute"
    },
    toTypo: {
        textAlign: "left",
        fontFamily: "Pretendard",
        fontWeight: "300",
        fontSize: 40,
        top: 111,
        position: "absolute"
    },
    groupLayout: {
        height: 16,
        // position: "absolute"
    },
    textTypo: {
        fontSize: 13,
        textAlign: "left",
        fontFamily: "Pretendard",
        fontWeight: "300",
        position: "absolute"
    },
    view0: {
        width: "100%",
        height: 50,
        position: 'relative'
    },
    view: {
        width: "100%",
        height: 240,
        flex: 1,
        position: 'relative'
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        fontFamily: "NanumSquare Neo OTF",
        fontWeight: "700",
        color: "#000",
        top: 0,
        position: "absolute"
    },
    text2: {
        marginLeft: -120.5,
        color: "#e40046"
    },
    text3: {
        marginLeft: 49.5,
        color: "#999"
    },
    view2: {
        top: 79,
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)",
        elevation: 7.4,
        borderRadius: 20,
        backgroundColor: "#fff",
        height: 161,
        width: '100%',
        position: "absolute"
    },
    child: {
        top: 125,
        maxHeight: "100%",
        color: "#d9d9d9",
        width: 347
    },
    sel: {
        left: '20%',
        color: "#e30247"
    },
    to: {
        left: '66%',
        color: "#999"
    },
    toActive: {
        left: '62%',
        color: "#E30247"
    },
    vectorIcon: {
        top: 127,
        left: 166,
        width: 14,
        color: "#000"
    },
    divider: {
        height: 1,
        backgroundColor: "#DEDEDE",
        top: 193,
        width: '100%',
        position: "absolute"
    },
    text4: {
        top: 160,
        left: '18.5%',
        color: "#000"
    },
    text5: {
        color: "#999"
    },
    group: {
        top: 208,
        // left: 117,
        // width: 160
    },
    text6: {
        // left: '30%',
        color: "#999",
        top: 0,
        fontSize: 13
    },
    vectorIcon2: {
        top: 1,
        width: 18,
        height: 14,
        color: "#e40046"
    }
});