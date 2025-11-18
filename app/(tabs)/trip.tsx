import CalendarInactiveIcon from '@/assets/images/calendarLightGray.svg';
import CalendarActiveIcon from '@/assets/images/calendarDarkGray.svg';
import ChangeEachOtherIcon from '@/assets/images/changeEachOther.svg';
import HeartActiveIcon from '@/assets/images/heartActive.svg';
import DateSelect from "@/components/trip/DateSelect";
import LocationSelect from "@/components/trip/LocationSelect";
import TypeSelect from "@/components/trip/TypeSelect";
import LocationCard, { LOCATION_CARD_FONT_SIZE, LOCATION_CARD_MARKER_SIZE } from "@/components/ui/LocationCard";
import LocationDetailOverlay from "@/components/ui/LocationDetailOverlay";
import UserDummy from "@/constants/UserDummy";
import { changeToThreeLetter } from "@/utils/changeToThreeLetter";
import dayjs from "dayjs";
import { Image, ImageSource } from "expo-image";
import { useEffect, useRef, useState, useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from "react-native";
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserCardItem = {
    type: 'user';
    nickname: string;
    introduction: string;
    favorite: string;
    image: ImageSource;
    follow: string;
    backgroundColor: string;
};

type LocationCardItem = {
    type: 'location';
    name: string;
    image: ImageSource;
};

type CardItem = UserCardItem | LocationCardItem;
type DateRange = {
    startDate: string | null;
    endDate: string | null;
};

export default function Trip() {
    const [locationSelectOpen, setLocationSelectOpen] = useState(false);
    const [dateSelectOpen, setDateSelectOpen] = useState(false);
    const [searchResult, setSearchResult] = useState<boolean>(false);
    const [filteredUserList, setFilteredUserList] = useState<any[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<LocationCardItem | null>(null);
    const [cardLayout, setCardLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [showTripContent, setShowTripContent] = useState(false);
    const [keepExpandedCardVisible, setKeepExpandedCardVisible] = useState(false);
    const [tripType, setTripType] = useState<string | undefined>(undefined);
    const [loveType, setLoveType] = useState<string | undefined>(undefined);

    const scrollRef = useRef<ScrollView>(null);

    const [selectedForm, setSelectedForm] = useState<{
        location: string | undefined;
        dateType: 'date' | 'day';
        dateRange: DateRange;
        period: 'weekend' | '2days' | '3days' | '4days' | '5days' | '1week+';
        month: string | undefined;
        tripType: string | undefined;
        loveType: string | undefined;
    }>({
        location: undefined,
        dateType: 'date',
        dateRange: {
            startDate: null,
            endDate: null,
        },
        period: 'weekend',
        month: undefined,
        tripType: undefined,
        loveType: undefined,
    });

    const evenCardList: CardItem[] = [
        {
            ...UserDummy[0],
            type: 'user',
        },
        {
            type: 'location',
            name: 'Tokyo, Japan',
            image: require('@/assets/images/location/tokyo.png'),
        },
        {
            type: 'location',
            name: 'Sydney, Australia',
            image: require('@/assets/images/location/sydney.png'),
        },
        {
            ...UserDummy[1],
            type: 'user',
        },
        {
            type: 'location',
            name: 'New York, United States',
            image: require('@/assets/images/location/newyork.png'),
        }
    ]

    const oddCardList: CardItem[] = [
        {
            type: 'location',
            name: 'Paris, France',
            image: require('@/assets/images/location/paris.png'),
        },
        {
            type: 'location',
            name: 'Singapore',
            image: require('@/assets/images/location/singapore.png'),
        },
        {
            ...UserDummy[2],
            type: 'user',
        },
        {
            type: 'location',
            name: 'Hawaii, United States',
            image: require('@/assets/images/location/hawaii.png'),
        },
        {
            type: 'location',
            name: 'Rome, Italy',
            image: require('@/assets/images/location/rome.png'),
        },
    ]

    // 모든 location card 추출
    const allLocationCards = useMemo(() => {
        return [...evenCardList, ...oddCardList].filter((item): item is LocationCardItem => item.type === 'location');
    }, []);

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

    // 애니메이션 관련 ref
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
    const cardRefs = useRef<{ [key: string]: View | null }>({});
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
        setSelectedLocation(null);
        setCardLayout(null);
        setShowTripContent(false);
        setKeepExpandedCardVisible(false);
        if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
            overlayTimeoutRef.current = null;
        }
    };

    const handleCardPress = (locationItem: LocationCardItem, cardKey: string) => {
        const cardRef = cardRefs.current[cardKey];
        if (!cardRef) return;

        cardRef.measureInWindow((x, y, width, height) => {
            setCardLayout({ x, y, width, height });
            setSelectedLocation(locationItem);
            setKeepExpandedCardVisible(false);
            if (overlayTimeoutRef.current) {
                clearTimeout(overlayTimeoutRef.current);
                overlayTimeoutRef.current = null;
            }

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

    useEffect(() => {
        if (!locationSelectOpen) {
            requestAnimationFrame(() => {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            });
        }
    }, [locationSelectOpen]);

    const handleSearch = () => {
        if (
            !selectedForm.location
            || (selectedForm.dateType === 'date' && (!selectedForm.dateRange.startDate || !selectedForm.dateRange.endDate))
            || (selectedForm.dateType === 'day' && (!selectedForm.period || !selectedForm.month))
            || !selectedForm.tripType
            || !selectedForm.loveType
        ) return;

        setSearchResult(true);

        const filteredUserList = UserDummy.filter((user) => {
            return user.favoriteLocation.includes(selectedForm.location ?? '')
                && user.tripType === selectedForm.tripType
                && user.loveType === selectedForm.loveType
                && (selectedForm.dateType === 'date' ? dayjs(user.date.startDate).isSame(dayjs(selectedForm.dateRange.startDate), 'day') && dayjs(user.date.endDate).isSame(dayjs(selectedForm.dateRange.endDate), 'day') : true)
                && (selectedForm.dateType === 'day' ? user.period.includes(selectedForm.period) : true)
                && (selectedForm.dateType === 'day' ? user.month.includes(selectedForm.month ?? 'none') : true)
        });
        setFilteredUserList(filteredUserList);
    }


    return !searchResult ? (
        <View>
            <Animated.View style={{ opacity: otherElementsOpacity }}>
                <ScrollView ref={scrollRef} style={{ position: 'relative', height: '110%', paddingTop: 80 }} contentContainerStyle={{ paddingBottom: 150 }}>
                <View style={[topStyles.view0]}>
                    <View style={{ position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={topStyles.text}>검색</Text>
                    </View>
                    <View style={{ width: '100%', height: 80, position: 'absolute', zIndex: 1000 }} />
                    <TouchableOpacity
                        onPress={() => setSelectedForm({ ...selectedForm, dateType: 'date' })}
                        style={{ zIndex: 1001 }}
                    // hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                    >
                        <Text style={[topStyles.text2, topStyles.textTypo1, selectedForm.dateType === 'date' ? { color: '#E30247' } : { color: '#999' }]}>날짜 지정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedForm({ ...selectedForm, dateType: 'day' })}
                        style={{ zIndex: 1001 }}
                    // hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                    >
                        <Text style={[topStyles.text3, topStyles.textTypo1, selectedForm.dateType === 'day' ? { color: '#E30247' } : { color: '#999' }]}>일수 지정</Text>
                    </TouchableOpacity>
                </View>
                {!locationSelectOpen ? (
                    <TouchableOpacity onPress={() => setLocationSelectOpen(true)} activeOpacity={1} style={[topStyles.view]}>
                        <View style={{ width: '100%', paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={[topStyles.view2, { height: selectedForm.dateType === 'date' ? 130 : 130 }]} />
                        </View>
                        <ChangeEachOtherIcon style={[topStyles.child, topStyles.childPosition, { marginTop: 2 }]} width={347} />
                        <Text style={[topStyles.sel, topStyles.toTypo]}>SEL</Text>
                        <Text style={[topStyles.to, topStyles.toTypo, selectedForm.location ? topStyles.toActive : '']}>{selectedForm.location ? changeToThreeLetter(selectedForm.location) : 'To'}</Text>
                        {/* <Component5 style={[topStyles.vectorIcon, topStyles.groupLayout]} width={14} height={16} /> */}
                        <Text style={[topStyles.text4, topStyles.textTypo]}>서울/모든 공항</Text>
                        <View style={{ position: 'absolute', right: '11%', top: 160, width: 140, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[topStyles.text5, selectedForm.location ? { color: '#333' } : '']}>{!selectedForm.location ? '도착지' : selectedForm.location}</Text>
                        </View>
                        {/* {tab === 'date' &&
                            <View style={{ width: '100%', paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={topStyles.divider} />
                            </View>
                        } */}
                        {/* {tab === 'date' &&
                            <View style={[topStyles.group, { width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5 }]}>
                                <CalendarIcon style={[topStyles.vectorIcon2, { position: 'relative', marginTop: -2 }]} width={18} height={14} />
                                <Text style={[topStyles.text6, topStyles.textTypo, { position: 'relative' }]}>{selectedForm.dateRange.startDate && selectedForm.dateRange.endDate ? `${dayjs(selectedForm.dateRange.startDate).format('YYYY.MM.DD')} ~ ${dayjs(selectedForm.dateRange.endDate).format('YYYY.MM.DD')}` : '가는 날 ~ 오는 날'}</Text>
                            </View>
                        } */}
                    </TouchableOpacity>
                ) : (
                    <LocationSelect
                        setLocationSelectOpen={setLocationSelectOpen}
                        location={selectedForm.location}
                        setLocation={(location: string) => setSelectedForm({ ...selectedForm, location })}
                    />
                )}

                {
                    !dateSelectOpen ? (
                        <TouchableOpacity onPress={() => setDateSelectOpen(true)} activeOpacity={1} style={{ width: '100%', paddingHorizontal: 24, position: 'relative', marginTop: -10 }}>
                            <View style={selectDateStyles.view}>
                                <View style={[selectDateStyles.view2, selectDateStyles.viewPosition]} />
                                <View style={[selectDateStyles.view3, selectDateStyles.viewPosition]} />
                                <Text style={[selectDateStyles.text, selectDateStyles.textTypo]}>{selectedForm.dateType === 'date' ? '날짜' : '일수'}</Text>
                                <Text style={[selectDateStyles.safeareaviewText, selectDateStyles.textTypo]}>{selectedForm.dateRange.endDate ? `${dayjs(selectedForm.dateRange.endDate).diff(dayjs(selectedForm.dateRange.startDate), 'day') + 1}일` : '일수'}</Text>
                            </View>
                        </TouchableOpacity>
                    ) : selectedForm.dateType === 'date' ? (
                        <DateSelect
                            setDateSelectOpen={setDateSelectOpen}
                            dateRange={selectedForm.dateRange}
                            setDateRange={(dateRange: DateRange) => setSelectedForm({ ...selectedForm, dateRange })}
                        />
                    ) : (
                        <View style={{ width: '100%', paddingHorizontal: 24, position: 'relative', marginTop: -10 }}>
                            <View style={{ boxShadow: "0px 5px 9.1px rgba(219, 79, 79, 0.1)", width: '100%', paddingHorizontal: 21, paddingVertical: 27, borderRadius: 20 }}>
                                <Text style={{ color: '#999' }}>여행 기간을 선택하세요.</Text>
                                <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                                    <TouchableOpacity onPress={() => setSelectedForm({ ...selectedForm, period: 'weekend' })} style={{ width: '30%', justifyContent: 'center', alignItems: 'center', paddingVertical: 13, borderRadius: 15, borderWidth: selectedForm.period === 'weekend' ? 1.5 : 1, borderColor: selectedForm.period === 'weekend' ? '#444' : '#bebebe', backgroundColor: selectedForm.period === 'weekend' ? '#d9d9d9' : '#fff' }}><Text>주말</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => setSelectedForm({ ...selectedForm, period: '2days' })} style={{ width: '30%', justifyContent: 'center', alignItems: 'center', paddingVertical: 13, borderRadius: 15, borderWidth: selectedForm.period === '2days' ? 1.5 : 1, borderColor: selectedForm.period === '2days' ? '#444' : '#bebebe', backgroundColor: selectedForm.period === '2days' ? '#d9d9d9' : '#fff' }}><Text>2일</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => setSelectedForm({ ...selectedForm, period: '3days' })} style={{ width: '30%', justifyContent: 'center', alignItems: 'center', paddingVertical: 13, borderRadius: 15, borderWidth: selectedForm.period === '3days' ? 1.5 : 1, borderColor: selectedForm.period === '3days' ? '#444' : '#bebebe', backgroundColor: selectedForm.period === '3days' ? '#d9d9d9' : '#fff' }}><Text>3일</Text></TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                                    <TouchableOpacity onPress={() => setSelectedForm({ ...selectedForm, period: '4days' })} style={{ width: '30%', justifyContent: 'center', alignItems: 'center', paddingVertical: 13, borderRadius: 15, borderWidth: selectedForm.period === '4days' ? 1.5 : 1, borderColor: selectedForm.period === '4days' ? '#444' : '#bebebe', backgroundColor: selectedForm.period === '4days' ? '#d9d9d9' : '#fff' }}><Text>4일</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => setSelectedForm({ ...selectedForm, period: '5days' })} style={{ width: '30%', justifyContent: 'center', alignItems: 'center', paddingVertical: 13, borderRadius: 15, borderWidth: selectedForm.period === '5days' ? 1.5 : 1, borderColor: selectedForm.period === '5days' ? '#444' : '#bebebe', backgroundColor: selectedForm.period === '5days' ? '#d9d9d9' : '#fff' }}><Text>5일</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => setSelectedForm({ ...selectedForm, period: '1week+' })} style={{ width: '30%', justifyContent: 'center', alignItems: 'center', paddingVertical: 13, borderRadius: 15, borderWidth: selectedForm.period === '1week+' ? 1.5 : 1, borderColor: selectedForm.period === '1week+' ? '#444' : '#bebebe', backgroundColor: selectedForm.period === '1week+' ? '#d9d9d9' : '#fff' }}><Text>일주일+</Text></TouchableOpacity>
                                </View>

                                <Text style={{ color: '#999', marginTop: 41 }}>여행 날짜를 선택하세요.</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={{ width: Dimensions.get('window').width - 48, height: 133, marginTop: 20, marginLeft: -24 }}
                                    contentContainerStyle={{ gap: 10, paddingHorizontal: 24 }}
                                >
                                    {['2025/11', '2025/12', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'].map((item, index) => {
                                        const [year, month] = item.split('/');
                                        return (
                                            <TouchableOpacity key={index} onPress={() => setSelectedForm({ ...selectedForm, month: item })} style={{ width: 110, justifyContent: 'center', alignItems: 'center', paddingVertical: 13, borderRadius: 15, borderWidth: selectedForm.month === item ? 1.5 : 1, borderColor: selectedForm.month === item ? '#444' : '#bebebe', height: 133, backgroundColor: selectedForm.month === item ? '#d9d9d9' : '#fff' }}>
                                                {selectedForm.month === item ?
                                                    <CalendarActiveIcon width={24} height={24} /> :
                                                    <CalendarInactiveIcon width={24} height={24} />
                                                }
                                                <Text style={{ marginTop: 14 }}>{month}</Text>
                                                <Text style={{ marginTop: 3, fontWeight: 300, color: '#999' }}>{year}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                    <View style={{ width: '30%', justifyContent: 'center', alignItems: 'center', paddingVertical: 13, borderRadius: 15, borderWidth: 1, borderColor: '#bebebe', height: 133 }}>
                                        <CalendarInactiveIcon width={24} height={24} />
                                        <Text style={{ marginTop: 14 }}>4월</Text>
                                        <Text style={{ marginTop: 3, fontWeight: 300, color: '#999' }}>2025</Text>
                                    </View>
                                </ScrollView>

                                <TouchableOpacity
                                    style={[
                                        styles.confirmButton,
                                        (!selectedForm.month || !selectedForm.period) && styles.confirmButtonDisabled,
                                    ]}
                                    onPress={() => {
                                        if (!selectedForm.month || !selectedForm.period) return;
                                        setDateSelectOpen(false);
                                    }}
                                    disabled={!selectedForm.month || !selectedForm.period}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.confirmButtonText}>다음</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
                <TypeSelect
                    tripType={selectedForm.tripType}
                    loveType={selectedForm.loveType}
                    setTripType={(tripType: string) => {
                        console.log('tripType', tripType);
                        setSelectedForm({ ...selectedForm, tripType })
                    }}
                    setLoveType={(loveType: string) => setSelectedForm({ ...selectedForm, loveType })}
                />

                <View style={{ position: 'relative', marginTop: 20, width: '100%', height: 50, paddingHorizontal: 20 }}>
                    <TouchableOpacity
                        onPress={handleSearch}
                        disabled={
                            !selectedForm.location
                            || (selectedForm.dateType === 'date' && (!selectedForm.dateRange.startDate || !selectedForm.dateRange.endDate))
                            || (selectedForm.dateType === 'day' && (!selectedForm.period || !selectedForm.month))
                            || !selectedForm.tripType
                            || !selectedForm.loveType
                        }
                        style={{
                            width: '100%', height: 50, backgroundColor: '#FF2D55', borderRadius: 10, justifyContent: 'center', alignItems: 'center',
                            opacity: !selectedForm.location || (selectedForm.dateType === 'date' && (!selectedForm.dateRange.startDate || !selectedForm.dateRange.endDate)) || (selectedForm.dateType === 'day' && (!selectedForm.period || !selectedForm.month)) || !selectedForm.tripType || !selectedForm.loveType ? 0.5 : 1
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>검색</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', paddingHorizontal: 20, flexDirection: 'row', gap: 10, position: 'relative', marginTop: 28 }}>
                    <View style={{ width: '48.5%', minHeight: 200, gap: 15 }}>
                        {evenCardList.map((item: any, index) => (
                            <View key={index} style={{ width: '100%' }}>
                                {item.type === 'user' ? (
                                    <View style={[userCardStyles.view]}>
                                        <View style={userCardStyles.view2} />
                                        <View style={[userCardStyles.vectorParent, userCardStyles.vectorLayout, { paddingRight: 10}]}>
                                            <Image source={item.image} style={[userCardStyles.vectorIcon, userCardStyles.vectorLayout, { borderRadius: 100 }]} />
                                            <Text style={userCardStyles.text}>{item.nickname}</Text>
                                            <Text style={[userCardStyles.safeareaviewText]}>{item.introduction}</Text>
                                        </View>
                                        <View style={userCardStyles.parent}>
                                            <Text style={[userCardStyles.text2, userCardStyles.textTypo]}>{`#${item?.tripType}`}</Text>
                                            <Text style={[userCardStyles.text3, userCardStyles.textTypo]}>{`#${item?.loveType}`}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => handleCardPress(item, `even-${index}`)}
                                        activeOpacity={1}
                                    >
                                        <LocationCard
                                            ref={(ref) => { cardRefs.current[`even-${index}`] = ref; }}
                                            image={item.image}
                                            name={item.name}
                                            containerStyle={{ width: '100%', height: Dimensions.get('window').width * 0.6, aspectRatio: 189 / 261 }}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>

                    <View style={{ width: '48.5%', minHeight: 200, gap: 15 }}>
                        {oddCardList.map((item: any, index) => (
                            <View key={index} style={{ width: '100%' }}>
                                {item.type === 'user' ? (
                                    <View style={userCardStyles.view}>
                                        <View style={userCardStyles.view2} />
                                        <View style={[userCardStyles.vectorParent, userCardStyles.vectorLayout, { paddingRight: 10}]}>
                                            <Image source={item.image} style={[userCardStyles.vectorIcon, userCardStyles.vectorLayout, { borderRadius: 100 }]} />
                                            <Text style={userCardStyles.text}>{item.nickname}</Text>
                                            <Text style={userCardStyles.safeareaviewText}>{item.introduction}</Text>
                                        </View>
                                        <View style={userCardStyles.parent}>
                                            <Text style={[userCardStyles.text2, userCardStyles.textTypo]}>{`#${item?.tripType}`}</Text>
                                            <Text style={[userCardStyles.text3, userCardStyles.textTypo]}>{`#${item?.loveType}`}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => handleCardPress(item, `odd-${index}`)}
                                        activeOpacity={1}
                                    >
                                        <LocationCard
                                            ref={(ref) => { cardRefs.current[`odd-${index}`] = ref; }}
                                            image={item.image}
                                            name={item.name}
                                            containerStyle={{ width: "100%", height: Dimensions.get('window').width * 0.6, aspectRatio: 189 / 261 }}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>

                </View>
            </ScrollView>
            </Animated.View>

            {/* 클릭된 카드의 absolute positioned 컴포넌트 */}
            {selectedLocation && cardLayout && (!showTripContent || keepExpandedCardVisible) && (
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
                        source={selectedLocation.image}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        contentFit="cover"
                    />
                    <Animated.View style={{ position: 'absolute', top: 14, right: 19, width: 25, height: 25, opacity: heartOpacity }}>
                        <HeartActiveIcon style={{ width: 25, height: 25 }} />
                    </Animated.View>
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
                            {selectedLocation.name}
                        </Animated.Text>
                    </View>
                </Animated.View>
            )}

            {/* Trip 콘텐츠 오버레이 - 애니메이션 완료 후 표시 */}
            {showTripContent && selectedLocation && (
                <LocationDetailOverlay
                    location={selectedLocation}
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
    ) : (
        <View>
            <ScrollView ref={scrollRef} style={{ position: 'relative', height: '110%', paddingTop: 80 }} contentContainerStyle={{ paddingBottom: 150 }}>
                <View style={topStyles.view0}>
                    <View style={{ position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={topStyles.text}>탐색하기</Text>
                    </View>
                    <TouchableOpacity onPress={() => setSearchResult(false)}>
                        <Text style={{ marginLeft: 20 }}>{`뒤로가기`}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ position: 'relative', width: '100%', paddingHorizontal: 20, gap: 18, marginTop: 50 }}>
                    {filteredUserList?.length > 0 ?
                        filteredUserList.map((item, index) => (
                            <View key={index} style={{ width: '100%' }}>
                                <View style={userCardStyles2.view}>
                                    <View style={[userCardStyles2.rectangleParent, userCardStyles2.groupChildPosition]}>
                                        <View style={[userCardStyles2.groupChild, userCardStyles2.groupChildPosition, { backgroundColor: item.backgroundColor }]} />
                                        <View style={userCardStyles2.view2}>
                                            <Text style={userCardStyles2.text}>{item.nickname}</Text>
                                            <Text style={[userCardStyles2.safeareaviewText, userCardStyles2.smallTalkTypo]}>{item.introduction}</Text>
                                        </View>
                                        <View style={userCardStyles2.view3}>
                                            <Text style={[userCardStyles2.text2, userCardStyles2.textTypo]}>{`#${item.loveType}`}</Text>
                                        </View>
                                        <Image source={item.image} style={[userCardStyles2.groupItem, { borderRadius: 100 }]} />
                                        <TouchableOpacity onPress={() => router.push(`/chatDetail?id=${item.id}`)} style={[userCardStyles2.view4, userCardStyles2.view4Layout]}>
                                            <View style={[userCardStyles2.child, userCardStyles2.view4Layout]} />
                                            <Text style={[userCardStyles2.smallTalk, userCardStyles2.smallTalkTypo]}>Small Talk</Text>
                                        </TouchableOpacity>
                                        <Text style={[userCardStyles2.text3, userCardStyles2.textTypo]}>
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
                        :
                        <View style={{ width: '100%', height: 200, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 300, color: '#444' }}>여행자가 없습니다.</Text>
                        </View>
                    }
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    confirmButton: {
        backgroundColor: '#FF2D55',
        // paddingHorizontal: 32,
        paddingVertical: 8,
        borderRadius: 10,
        width: 88,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
        marginTop: 40
    },
    confirmButtonDisabled: {
        backgroundColor: '#FFD1DD',
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: "NanumSquare Neo",
    },
})

const userCardStyles2 = StyleSheet.create({
    safeareaview: {
        flex: 1
    },
    groupChildPosition: {
        bottom: "0%",
        right: "0%",
        top: "0%",
        height: "100%",
        left: "0%",
        position: "absolute",
        width: "100%"
    },
    smallTalkTypo: {
        fontSize: 14,
        textAlign: "left",
        color: "#000",
        fontFamily: "NanumSquare Neo",
        left: "50%",
        position: "absolute"
    },
    textTypo: {
        fontWeight: "300",
        fontSize: 13,
        textAlign: "left",
        color: "#000",
        fontFamily: "NanumSquare Neo",
        position: "absolute"
    },
    view4Layout: {
        height: 29,
        width: 137,
        left: "50%",
        position: "absolute"
    },
    view: {
        height: 210,
        width: "100%",
        flex: 1
    },
    rectangleParent: {
        left: "0%"
    },
    groupChild: {
        boxShadow: "0px 0px 24px rgba(0, 0, 0, 0.18)",
        elevation: 18,
        borderRadius: 20,
        left: "0%"
    },
    view2: {
        marginLeft: -65,
        top: 23,
        height: 47,
        width: 133,
        left: "50%",
        position: "absolute"
    },
    text: {
        top: 0,
        fontSize: 20,
        textAlign: "left",
        color: "#000",
        fontFamily: "NanumSquare Neo",
        fontWeight: "800",
        marginLeft: -66.5,
        width: 133,
        left: "50%",
        position: "absolute"
    },
    safeareaviewText: {
        top: 32,
        fontSize: 14,
        marginLeft: -66.5,
        width: 133
    },
    view3: {
        width: "30.14%",
        right: "76.29%",
        bottom: 20,
        left: "6.57%",
        height: 14,
        position: "absolute"
    },
    text2: {
        bottom: 0,
        left: "0%"
    },
    groupItem: {
        top: 17,
        left: 15,
        width: 76,
        height: 76,
        color: "#fff",
        position: "absolute"
    },
    view4: {
        marginLeft: 13,
        bottom: 12
    },
    child: {
        marginLeft: -68.5,
        boxShadow: "0px 0px 10.2px #fff",
        elevation: 10.2,
        borderRadius: 15,
        backgroundColor: "#fff",
        bottom: 0
    },
    smallTalk: {
        marginLeft: -36.5,
        bottom: 7,
        fontWeight: "800",
        fontSize: 14
    },
    text3: {
        top: 110,
        left: 23
    },
    text4: {
        marginBottom: 4
    },
    icon: {
        top: 13,
        right: 13,
        width: 24,
        height: 21,
        position: "absolute"
    }
});

const selectDateStyles = StyleSheet.create({
    safeareaview: {
        flex: 1
    },
    viewPosition: {
        width: '100%',
        borderRadius: 20,
        top: 0,
        position: "absolute",
        height: 55
    },
    textTypo: {
        fontFamily: "Pretendard",
        fontWeight: "300",
        fontSize: 13,
        top: 20,
        position: "absolute"
    },
    view: {
        width: "100%",
        height: 55,
        flex: 1,
        alignItems: 'center'
    },
    view2: {
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff"
    },
    view3: {
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderStyle: "solid",
        borderColor: "#999",
    },
    text: {
        left: '6%',
        color: "#5e5e5e",
        textAlign: "left"
    },
    safeareaviewText: {
        left: '85%',
        color: "#090909",
        textAlign: "right"
    }
});

const userCardStyles = StyleSheet.create({
    vectorLayout: {
        height: 41,
        position: "absolute"
    },
    textTypo: {
        fontSize: 11,
        fontWeight: "300",
        textAlign: "left",
        color: "#000",
        fontFamily: "NanumSquare Neo OTF",
        top: 0,
        position: "absolute"
    },
    view: {
        width: "100%",
        elevation: 7,
        minHeight: 104,
        overflow: 'hidden',
    },
    view2: {
        borderRadius: 24,
        backgroundColor: "#ffd8e4",
        width: '98%',
        left: 0,
        top: 0,
        position: "absolute",
        height: 104,
        boxShadow: "0px 2px 7px rgba(0, 0, 0, 0.25)",
    },
    vectorParent: {
        width: "62.87%",
        top: 17,
        right: "26.35%",
        left: "10.78%"
    },
    vectorIcon: {
        width: "38.86%",
        right: "61.14%",
        left: "0%",
        maxWidth: "100%",
        overflow: "hidden",
        color: "#999",
        top: 0
    },
    text: {
        top: 3,
        fontSize: 15,
        fontWeight: "700",
        textAlign: "left",
        color: "#000",
        fontFamily: "NanumSquare Neo OTF",
        left: 53,
        position: "absolute"
    },
    safeareaviewText: {
        top: 27,
        fontSize: 12,
        color: "#444",
        fontWeight: "300",
        textAlign: "left",
        fontFamily: "NanumSquare Neo OTF",
        left: 53,
        position: "absolute"
    },
    parent: {
        top: 76,
        left: 22,
        width: 123,
        height: 12,
        position: "absolute"
    },
    text2: {
        left: -10
    },
    text3: {
        left: 60
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
        height: 'auto',
        position: 'relative'
    },
    view: {
        width: "100%",
        height: 240,
        // flex: 1,
        position: 'relative',
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
    },
    text3: {
        marginLeft: 49.5,
    },
    view2: {
        top: 79,
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)",
        elevation: 7.4,
        borderRadius: 20,
        backgroundColor: "#fff",
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