import CreateIcon from '@/assets/images/createIcon.svg';
import SearchRedIcon from '@/assets/images/searchRed.svg';
import UserDummy from '@/constants/UserDummy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from "dayjs";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Chat() {
    const scrollRef = useRef<ScrollView>(null);

    const [searchKeyword, setSearchKeyword] = useState('');

    const [chatList, setChatList] = useState<any>([])

    useEffect(() => {
        (async () => {
            let savedChatList = await AsyncStorage.getItem('chatList')
            savedChatList = savedChatList ? JSON.parse(savedChatList) : []


            if(savedChatList && savedChatList?.length > 0) {
                setChatList(savedChatList)
            } else {
                AsyncStorage.setItem('chatList', JSON.stringify([UserDummy[0], UserDummy[3], UserDummy[7], UserDummy[9]]))
                setChatList([UserDummy[0], UserDummy[3], UserDummy[7], UserDummy[9]])
            }
        })()
    }, [])

    return (
        <SafeAreaView style={{ paddingTop: 10 }}>
            <View style={[topStyles.view0, { zIndex: 1000 }]}>
                <View style={{ position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={topStyles.text}>채팅</Text>
                </View>
            </View>

            <View style={{ width: '100%', paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                <View style={searchBarStyles.view}>
                    <View style={[searchBarStyles.view2, searchBarStyles.viewPosition, { zIndex: 1 }]} pointerEvents="none" />
                    <View style={[searchBarStyles.view3, searchBarStyles.viewPosition, { zIndex: 1 }]} pointerEvents="none" />
                    <SearchRedIcon width={24} height={24} style={{ position: 'absolute', left: 24, top: 16, zIndex: 1, pointerEvents: 'none' }} />
                    <TextInput
                        value={searchKeyword}
                        onChangeText={setSearchKeyword}
                        placeholder="Search Here"
                        placeholderTextColor="#999"
                        style={[searchBarStyles.searchInput, { zIndex: 9999 }]}
                        editable={true}
                        autoCorrect={false}
                        pointerEvents="auto"
                    />
                </View>
            </View>

            <ScrollView
                ref={scrollRef}
                style={{ position: 'relative', height: '110%', paddingTop: 50 }}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                <View style={{ width: '100%', paddingHorizontal: 24, justifyContent: 'center', marginTop: 31, gap: 10 }}>
                    {
                        chatList.map((chat: any, index: number) => (
                            <TouchableOpacity onPress={() => router.push(`/chatDetail?id=${chat.id}`)} key={index} style={chatBoxStyles.view}>
                                <View style={chatBoxStyles.view2}>
                                    <View style={[chatBoxStyles.view3, chatBoxStyles.viewPosition]} />
                                    <View style={[chatBoxStyles.view4, chatBoxStyles.viewPosition]} />
                                </View>
                                {/* <Image style={chatBoxStyles.vectorIcon} source={chat.userIcon} /> */}
                                <Text style={[chatBoxStyles.jennifer, chatBoxStyles.pm0234Typo]}>{chat?.nickname}</Text>
                                <Image style={[chatBoxStyles.icon, chatBoxStyles.iconPosition, { borderRadius: 100 }]} source={chat?.image} />
                                <Text style={[chatBoxStyles.heyWillYou, chatBoxStyles.pm0234Typo]}>{chat?.message[0]?.text}</Text>
                                <Text style={[chatBoxStyles.pm0234, chatBoxStyles.iconPosition]}>{dayjs(chat?.message[0]?.time).format('A HH:mm')}</Text>
                                {/* <Component3 style={[chatBoxStyles.safeareaviewIcon, chatBoxStyles.iconLayout]} /> */}
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const chatBoxStyles = StyleSheet.create({
    safeareaview: {
        flex: 1
    },
    viewPosition: {
        borderRadius: 20,
        left: "0%",
        bottom: "0%",
        right: "0%",
        top: "0%",
        height: "100%",
        position: "absolute",
        width: "100%"
    },
    pm0234Typo: {
        textAlign: "left",
        fontFamily: "Pretendard"
    },
    iconPosition: {
        top: "16.67%",
        position: "absolute"
    },
    iconLayout: {
        maxHeight: "100%",
        overflow: "hidden",
        maxWidth: "100%"
    },
    view: {
        height: 84,
        width: "100%",
        flex: 1
    },
    view2: {
        left: "0%",
        bottom: "0%",
        right: "0%",
        top: "0%",
        height: "100%",
        position: "absolute",
        width: "100%"
    },
    view3: {
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)",
        elevation: 9.1,
        backgroundColor: "#fff"
    },
    view4: {
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderStyle: "solid",
        borderColor: "#999",
    },
    vectorIcon: {
        height: "19.05%",
        width: "0.54%",
        top: "40.48%",
        right: "4.05%",
        bottom: "40.48%",
        left: "95.41%",
        color: "#999",
        maxHeight: "100%",
        overflow: "hidden",
        maxWidth: "100%",
        position: "absolute"
    },
    jennifer: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        left: "25.95%",
        textAlign: "left",
        fontFamily: "Pretendard",
        position: "absolute",
        top: "19.05%"
    },
    icon: {
        height: 57,
        width: 57,
        right: "78.65%",
        bottom: "15.48%",
        left: "5.95%",
        // maxHeight: "100%",
        overflow: "hidden",
        // maxWidth: "100%"
    },
    heyWillYou: {
        top: "46.43%",
        fontSize: 13,
        fontWeight: "300",
        color: "#000",
        left: "25.95%",
        textAlign: "left",
        fontFamily: "Pretendard",
        position: "absolute"
    },
    pm0234: {
        left: "82.16%",
        fontSize: 12,
        fontWeight: "200",
        textAlign: "left",
        fontFamily: "Pretendard",
        top: "16.67%",
        color: "#999"
    },
    safeareaviewIcon: {
        height: "8.21%",
        width: "3.78%",
        right: "19.46%",
        bottom: "72.74%",
        left: "76.76%",
        top: "19.05%",
        position: "absolute",
        maxHeight: "100%",
        overflow: "hidden",
        maxWidth: "100%"
    }
});


const searchBarStyles = StyleSheet.create({
    viewPosition: {
        width: '100%',
        borderRadius: 20,
        // left: "50%",
        top: 0,
        // marginLeft: -185,
        position: "absolute",
        height: 55
    },
    view: {
        width: "100%",
        height: 55,
        flex: 1
    },
    view2: {
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)",
        elevation: 9.1,
        backgroundColor: "#fff"
    },
    view3: {
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderStyle: "solid",
        borderColor: "#999",
        // borderWidth: 1
    },
    searchInput: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 55,
        borderRadius: 20,
        paddingLeft: 60,
        paddingRight: 20,
        fontSize: 14,
        fontWeight: "300",
        fontFamily: "Pretendard",
        color: "#000",
        backgroundColor: "transparent"
    },
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