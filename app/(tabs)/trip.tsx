import CalendarInactiveIcon from '@/assets/images/calendarLightGray.svg';
import CalendarActiveIcon from '@/assets/images/calendarDarkGray.svg';
import ChangeEachOtherIcon from '@/assets/images/changeEachOther.svg';
import DateSelect from "@/components/trip/DateSelect";
import LocationSelect from "@/components/trip/LocationSelect";
import TypeSelect from "@/components/trip/TypeSelect";
import LocationCard from "@/components/ui/LocationCard";
import UserDummy from "@/constants/UserDummy";
import { changeToThreeLetter } from "@/utils/changeToThreeLetter";
import dayjs from "dayjs";
import { Image, ImageSource } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
            type: 'user',
            nickname: '닉네임',
            introduction: '한줄소개',
            favorite: '#연애취향',
            image: require('@/assets/images/userIcon.png'),
            follow: 'Follow',
            backgroundColor: '#ffd8e4',
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
            type: 'user',
            nickname: '닉네임',
            introduction: '한줄소개',
            favorite: '#연애취향',
            image: require('@/assets/images/userIcon.png'),
            follow: 'Follow',
            backgroundColor: '#C9FFF5',
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
            type: 'user',
            nickname: '닉네임',
            introduction: '한줄소개',
            favorite: '#연애취향',
            image: require('@/assets/images/userIcon.png'),
            follow: 'Follow',
            backgroundColor: '#C9FFF5',
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

    useEffect(() => {
        if (!locationSelectOpen) {
            requestAnimationFrame(() => {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            });
        }
    }, [locationSelectOpen]);

    const handleSearch = () => {
        if (!selectedForm.location || (selectedForm.dateType === 'date' && (!selectedForm.dateRange.startDate || !selectedForm.dateRange.endDate)) || (selectedForm.dateType === 'day' && (!selectedForm.period || !selectedForm.month)) || !selectedForm.tripType || !selectedForm.loveType) return;

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
                        style={{ width: '100%', height: 50, backgroundColor: '#FF2D55', borderRadius: 10, justifyContent: 'center', alignItems: 'center', 
                            opacity: !selectedForm.location || (selectedForm.dateType === 'date' && (!selectedForm.dateRange.startDate || !selectedForm.dateRange.endDate)) || (selectedForm.dateType === 'day' && (!selectedForm.period || !selectedForm.month)) || !selectedForm.tripType || !selectedForm.loveType ? 0.5 : 1 }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>검색</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', paddingHorizontal: 20, flexDirection: 'row', gap: 10, position: 'relative', marginTop: 28 }}>
                    <View style={{ width: '48.5%', minHeight: 200, gap: 15 }}>
                        {evenCardList.map((item, index) => (
                            <View key={index} style={{ width: '100%' }}>
                                {item.type === 'user' ? (
                                    <View style={userCardStyles.view}>
                                        <View style={userCardStyles.view2} />
                                        <View style={[userCardStyles.vectorParent, userCardStyles.vectorLayout]}>
                                            <Image source={item.image} style={[userCardStyles.vectorIcon, userCardStyles.vectorLayout]} />
                                            <Text style={userCardStyles.text}>닉네임</Text>
                                            <Text style={userCardStyles.safeareaviewText}>한 줄 소개</Text>
                                        </View>
                                        <View style={userCardStyles.parent}>
                                            <Text style={[userCardStyles.text2, userCardStyles.textTypo]}>#여행 타입</Text>
                                            <Text style={[userCardStyles.text3, userCardStyles.textTypo]}>#연애 타입</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <LocationCard
                                        image={item.image}
                                        name={item.name}
                                        containerStyle={{ width: '100%', height: Dimensions.get('window').width * 0.6, aspectRatio: 189 / 261 }}
                                    />
                                )}
                            </View>
                        ))}
                    </View>

                    <View style={{ width: '48.5%', minHeight: 200, gap: 15 }}>
                        {oddCardList.map((item, index) => (
                            <View key={index} style={{ width: '100%' }}>
                                {item.type === 'user' ? (
                                    <View style={userCardStyles.view}>
                                        <View style={userCardStyles.view2} />
                                        <View style={[userCardStyles.vectorParent, userCardStyles.vectorLayout]}>
                                            <Image source={item.image} style={[userCardStyles.vectorIcon, userCardStyles.vectorLayout]} />
                                            <Text style={userCardStyles.text}>닉네임</Text>
                                            <Text style={userCardStyles.safeareaviewText}>한 줄 소개</Text>
                                        </View>
                                        <View style={userCardStyles.parent}>
                                            <Text style={[userCardStyles.text2, userCardStyles.textTypo]}>#여행 타입</Text>
                                            <Text style={[userCardStyles.text3, userCardStyles.textTypo]}>#연애 타입</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <LocationCard
                                        image={item.image}
                                        name={item.name}
                                        containerStyle={{ width: "100%", height: Dimensions.get('window').width * 0.6, aspectRatio: 189 / 261 }}
                                    />
                                )}
                            </View>
                        ))}
                    </View>

                </View>
            </ScrollView>
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
                    {
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
                                        <Image source={item.image} style={userCardStyles2.groupItem} />
                                        <View style={[userCardStyles2.view4, userCardStyles2.view4Layout]}>
                                            <View style={[userCardStyles2.child, userCardStyles2.view4Layout]} />
                                            <Text style={[userCardStyles2.smallTalk, userCardStyles2.smallTalkTypo]}>Small Talk</Text>
                                        </View>
                                        <Text style={[userCardStyles2.text3, userCardStyles2.textTypo]}>
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
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
        height: 104,
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
        left: 0
    },
    text3: {
        left: 69
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