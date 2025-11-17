import ArrowGray from '@/assets/images/arrowGray.svg';
import SendIcon from '@/assets/images/sendIcon.svg';
import UserDummy from "@/constants/UserDummy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChatDetail() {
    const { id } = useLocalSearchParams()

    const chatObj: any = UserDummy.find(user => user.id === Number(id))

    const [messageList, setMessageList] = useState(chatObj.message)
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        (async () => {
            let chatDate = await AsyncStorage.getItem(`chat_${id}`)
            chatDate = chatDate ? JSON.parse(chatDate) : null
            if(!chatDate) {
                chatDate = chatObj.message
            }
            setMessageList(chatDate)
        })()
    }, [id])

    const handleSendMessage = () => {
        const newMessageList = [...messageList, { text: inputMessage, time: new Date().toISOString(), isUser: true }]
        setMessageList(newMessageList)
        AsyncStorage.setItem(`chat_${id}`, JSON.stringify(newMessageList))
        setInputMessage('')
    }

    useEffect(() => {
        (async () => {  
            let savedChatList: any = await AsyncStorage.getItem('chatList')
            savedChatList = savedChatList ? JSON.parse(savedChatList) : []

            console.log('savedChatList', savedChatList);

            if(!savedChatList?.find((chat: any) => chat.id === Number(id))) {
                savedChatList.unshift(chatObj)
                AsyncStorage.setItem('chatList', JSON.stringify(savedChatList))
            }
        })()
    }, [])

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <View style={headerStyles.view}>
                <View style={headerStyles.child} />
                <Text style={headerStyles.jennifer}>Jennifer</Text>
                <TouchableOpacity onPress={() => router.back()} style={[headerStyles.arrowLeft, headerStyles.arrowLeftPosition]}>
                    <ArrowGray style={[headerStyles.icon, headerStyles.iconLayout]} />
                </TouchableOpacity>
                <View style={[headerStyles.phoneCall, headerStyles.arrowLeftPosition]}>
                    {/* <Component1 style={[headerStyles.icon2, headerStyles.iconLayout]} /> */}
                </View>
            </View>

            <ScrollView style={{ flex: 1, backgroundColor: '#FFEBEB', width: '100%' }} contentContainerStyle={{ width: '100%', paddingBottom: 50, paddingTop: 20, paddingHorizontal: 21, minHeight: Dimensions.get('window').height - 100, gap: 14 }}>
                {
                    messageList.map((chatItem: any, index: number) => (
                        <View key={index} style={{ flexDirection: 'row', width: '100%' }}>
                            {
                                chatItem.isUser ? (
                                    <View style={{ flexDirection: 'row', marginLeft: 'auto', maxWidth: '100%' }}>
                                        <View style={{ backgroundColor: '#FF2D55', borderRadius: 10, borderBottomRightRadius: 0, padding: 8 }}>
                                            <Text>{chatItem.text}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: 'row', gap: 16 }}>
                                        <TouchableOpacity onPress={() => router.push(`/userProfile?id=${chatObj.id}`)}>
                                            <Image source={chatObj.image} style={{ width: 45, height: 45, minWidth: 45, minHeight: 45, maxWidth: '100%' }} contentFit="cover" />
                                        </TouchableOpacity>
                                        <View style={{ backgroundColor: '#E6E6E6', borderRadius: 10, borderBottomLeftRadius: 0, padding: 8, maxWidth: '80%' }}>
                                            <Text>{chatItem.text}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                    ))
                }
            </ScrollView>

            <View style={bottomStyles.view}>
                <View style={bottomStyles.child} />
                <View style={{ width: '100%', paddingHorizontal: 21, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={bottomStyles.item}>
                        <TextInput
                            value={inputMessage}
                            onChangeText={setInputMessage}
                            onSubmitEditing={handleSendMessage}
                            returnKeyType="send"
                            blurOnSubmit={false}
                            placeholder="메시지 입력"
                            placeholderTextColor="#999"
                            style={bottomStyles.textInput}
                        />
                    </View>
                    <TouchableOpacity onPress={handleSendMessage}>
                        <SendIcon style={[bottomStyles.icon2, { marginBottom: -10 }]} />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const bottomStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    sendPosition: {
        overflow: "hidden",
        position: "absolute"
    },
    iconPosition: {
        color: "#ff2d55",
        maxHeight: "100%",
        maxWidth: "100%",
        left: "8.33%",
        top: "8.33%",
        overflow: "hidden",
        position: "absolute"
    },
    view: {
        width: "100%",
        height: 93,
        flex: 1,
        position: 'absolute',
        bottom: 0,
    },
    child: {
        // marginLeft: -201,
        top: 0,
        // left: "50%",
        backgroundColor: "#fff",
        width: '100%',
        position: "absolute",
        height: 93
    },
    item: {
        top: 7,
        borderRadius: 15,
        backgroundColor: "#efeff0",
        width: '88%',
        height: 35,
        paddingLeft: 13,
        justifyContent: 'center',
    },
    textInput: {
        width: "100%",
        height: "100%",
        fontSize: 12,
        fontWeight: "300",
        fontFamily: "NanumSquare Neo",
        color: "#000"
    },
    plusCircle: {
        top: 13,
        left: 14,
        width: 24,
        height: 24
    },
    icon: {
        height: "83.33%",
        width: "83.33%",
        right: "8.33%",
        bottom: "8.33%"
    },
    send: {
        top: 10,
        left: 396,
        width: 32,
        height: 32,
        transform: [
            {
                rotate: "180deg"
            }
        ]
    },
    icon2: {
        height: 24,
        width: 24,
    }
});

const headerStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    arrowLeftPosition: {
        overflow: "hidden",
        position: "absolute"
    },
    iconLayout: {
        maxHeight: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        position: "absolute"
    },
    view: {
        width: "100%",
        height: 120,
        zIndex: 1000,
    },
    child: {
        top: 0,
        left: 0,
        boxShadow: "0px 4px 16.3px rgba(0, 0, 0, 0.25)",
        elevation: 16.3,
        backgroundColor: "#fff",
        width: '100%',
        position: "absolute",
        height: 120
    },
    jennifer: {
        marginLeft: -41.79,
        top: 68,
        left: "50%",
        fontSize: 20,
        fontWeight: "700",
        fontFamily: "NanumSquare Neo OTF",
        color: "#000",
        textAlign: "center",
        position: "absolute"
    },
    arrowLeft: {
        top: 60,
        left: 20,
        width: 40,
        height: 40
    },
    icon: {
        height: "58.25%",
        width: "58.25%",
        top: "20.83%",
        right: "20.92%",
        bottom: "20.92%",
        left: "20.83%",
        color: "#b3b3b3"
    },
    phoneCall: {
        top: 69,
        left: 311,
        width: 20,
        height: 20
    },
    icon2: {
        height: "87%",
        width: "87%",
        top: "4.17%",
        right: "4.2%",
        bottom: "8.83%",
        left: "8.8%",
        color: "#5a5a5a"
    }
});