import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChangeEachOtherIcon from '@/assets/images/changeEachOther.svg';
import CalendarIcon from '@/assets/images/calendarRed.svg';
import { useState } from "react";
import { Image, ImageSource } from "expo-image";
import LocationCard from "@/components/ui/LocationCard";
import SearchRedIcon from '@/assets/images/searchRed.svg';
import LocationSelect from "@/components/trip/LocationSelect";
import DateSelect from "@/components/trip/DateSelect";

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

    const [selectedForm, setSelectedForm] = useState<{
        location: string | undefined;
        dateRange: DateRange;
    }>({
        location: undefined,
        dateRange: {
            startDate: null,
            endDate: null,
        },
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


    return (
        <SafeAreaView>
            <ScrollView style={{ position: 'relative', height: '100%' }}>
                <View style={topStyles.view0}>
                    <Text style={topStyles.text}>검색</Text>
                    <Text style={[topStyles.text2, topStyles.textTypo1]}>날짜 지정</Text>
                    <Text style={[topStyles.text3, topStyles.textTypo1]}>일수 지정</Text>
                </View>
                {!locationSelectOpen ? (
                    <TouchableOpacity onPress={() => setLocationSelectOpen(true)} activeOpacity={1} style={topStyles.view}>
                        <View style={topStyles.view2} />
                        <ChangeEachOtherIcon style={[topStyles.child, topStyles.childPosition]} width={347} />
                        <Text style={[topStyles.sel, topStyles.toTypo]}>SEL</Text>
                        <Text style={[topStyles.to, topStyles.toTypo]}>To</Text>
                        {/* <Component5 style={[topStyles.vectorIcon, topStyles.groupLayout]} width={14} height={16} /> */}
                        <Text style={[topStyles.text4, topStyles.textTypo]}>서울/모든 공항</Text>
                        <Text style={[topStyles.text5, topStyles.textTypo]}>도착지</Text>
                        <View style={topStyles.divider} />
                        <View style={[topStyles.group, topStyles.groupLayout]}>
                            <Text style={[topStyles.text6, topStyles.textTypo]}>가는 날 ~ 오는 날</Text>
                            <CalendarIcon style={[topStyles.vectorIcon2, topStyles.childPosition]} width={18} height={14} />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <LocationSelect
                        setLocationSelectOpen={setLocationSelectOpen}
                        location={selectedForm.location}
                        setLocation={(location: string) => setSelectedForm({ ...selectedForm, location })}
                    />
                )}

                {!dateSelectOpen ? (
                <TouchableOpacity onPress={() => setDateSelectOpen(true)} activeOpacity={1} style={{ width: '100%', paddingHorizontal: 24, position: 'relative', marginTop: 20 }}>
                    <View style={selectDateStyles.view}>
                        <View style={[selectDateStyles.view2, selectDateStyles.viewPosition]} />
                        <View style={[selectDateStyles.view3, selectDateStyles.viewPosition]} />
                        <Text style={[selectDateStyles.text, selectDateStyles.textTypo]}>날짜</Text>
                        <Text style={[selectDateStyles.safeareaviewText, selectDateStyles.textTypo]}>일주일</Text>
                    </View>
                </TouchableOpacity>
                ) : (
                    <DateSelect
                        setDateSelectOpen={setDateSelectOpen}
                        dateRange={selectedForm.dateRange}
                        setDateRange={(dateRange: DateRange) => setSelectedForm({ ...selectedForm, dateRange })}
                    />
                )}

                <View style={filterStyles.view}>
                    <View style={[filterStyles.view2, filterStyles.viewPosition]}>
                        <View style={[filterStyles.view3, filterStyles.viewPosition]} />
                        <Text style={[filterStyles.text, filterStyles.textTypo]}>선택해주세요</Text>
                        <Text style={[filterStyles.safeareaviewText, filterStyles.textTypo]}>여행 타입</Text>
                        {/* <Component1 style={filterStyles.adjustmentsoutlineIcon} width={25} height={24} /> */}
                    </View>
                    <View style={[filterStyles.view4, filterStyles.viewPosition]}>
                        <View style={[filterStyles.view3, filterStyles.viewPosition]} />
                        <Text style={[filterStyles.text, filterStyles.textTypo]}>선택해주세요</Text>
                        <Text style={[filterStyles.safeareaviewText, filterStyles.textTypo]}>연애 타입</Text>
                        {/* <Component7 style={filterStyles.adjustmentsoutlineIcon} width={25} height={24} /> */}
                    </View>
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
                                        containerStyle={{ width: "100%", aspectRatio: 189 / 261 }}
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
                                        containerStyle={{ width: "100%", aspectRatio: 189 / 261 }}
                                    />
                                )}
                            </View>
                        ))}
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

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
        // flex: 1
    },
    view2: {
        borderRadius: 24,
        backgroundColor: "#ffd8e4",
        width: 167,
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

const filterStyles = StyleSheet.create({
    viewPosition: {
        width: 167,
        left: "50%",
        top: 0,
        position: "absolute",
        height: 52
    },
    textTypo: {
        textAlign: "left",
        fontFamily: "NanumSquare Neo OTF",
        left: 12,
        position: "absolute"
    },
    view: {
        width: "100%",
        height: 52,
        marginTop: 17,
        position: 'relative'
    },
    view2: {
        marginLeft: -170
    },
    view3: {
        marginLeft: -87.5,
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)",
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
        position: "absolute"
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
        flex: 1,
        position: 'relative'
    },
    text: {
        marginLeft: -19.5,
        fontSize: 20,
        textAlign: "center",
        fontFamily: "NanumSquare Neo OTF",
        fontWeight: "700",
        color: "#000",
        left: "50%",
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
        marginLeft: -173.5,
        top: 79,
        boxShadow: "0px 4px 7.4px rgba(0, 0, 0, 0.25)",
        elevation: 7.4,
        borderRadius: 20,
        backgroundColor: "#fff",
        height: 161,
        width: 347,
        left: "50%",
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
        left: '65%',
        color: "#999"
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
        width: 347,
        left: "50%",
        marginLeft: -173.5,
        position: "absolute"
    },
    text4: {
        top: 160,
        left: '18.5%',
        color: "#000"
    },
    text5: {
        top: 157,
        left: '66%',
        color: "#999"
    },
    group: {
        top: 208,
        left: 117,
        width: 112
    },
    text6: {
        left: '30%',
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