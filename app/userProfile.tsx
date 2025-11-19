import ArrowGray from '@/assets/images/arrowGray.svg';
import UserDummy from "@/constants/UserDummy";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CustomText as Text } from '@/components/CustomText';
import { useEffect, useState } from 'react';
import supabase from '@/db';

export default function UserProfile() {
    const { id, real } = useLocalSearchParams()

    const [userInfo, setUserInfo] = useState<any>(null);

    console.log('\n\n\n', id, real)

    useEffect(() => {
        if(real) {
            (async () => {
                const _userInfo = await supabase.from('user').select('*').eq('pk', id).single();
                console.log('_userInfo', _userInfo);
                console.log('id', id);
                setUserInfo(_userInfo.data);
            })()
        } else {
            const _userInfo = UserDummy.find(user => user.id === Number(id));
            setUserInfo(_userInfo);
        }
    }, [id, real])

    if(!userInfo) return null;

    return (
        <View style={{ flex: 1, position: 'relative', backgroundColor: '#EAE8E8' }}>
            <TouchableOpacity onPress={() => router.back()}>
                <ArrowGray style={{ position: 'absolute', left: 20, top: 70 }} />
            </TouchableOpacity>

            <View style={{ position: 'absolute', bottom: 65, width: '100%', justifyContent: 'center', paddingHorizontal: 35 }}>
                <View style={[styles.view]}>
                    <View style={styles.child} />
                    <View style={[styles.view2, styles.itemLayout]}>
                        <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={[styles.item, styles.itemLayout]} />
                            <Text style={[styles.smallTalk, styles.jenniferTypo]}>Small Talk</Text>
                        </View>
                    </View>
                    <Text style={[styles.jennifer, styles.text2Typo]}>{userInfo?.nickname ?? userInfo?.name ?? '닉네임 없음'}</Text>
                    <Image source={userInfo?.image ?? require('@/assets/images/userIcon.png')} style={[styles.inner, styles.iconLayout, { borderRadius: 100 }]} />
                    <View style={{ position: 'absolute', top: 130, left: 0, width: '100%', alignItems: 'center' }}>
                        <View style={[styles.parent, { width: 'auto', flexDirection: 'row', gap: 50 }]}>
                            <Text style={[styles.text, styles.textTypo]}>{`#${userInfo?.tripType ? userInfo?.tripType : userInfo?.trip_type ?? '여행 타입 없음'}`}</Text>
                            <Text style={[styles.safeareaviewText, styles.textTypo]}>{`#${userInfo?.loveType ?? userInfo?.love_type ?? '연애 타입 없음'}`}</Text>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', alignItems: 'center' }}>
                        <Text style={[styles.text2, styles.text2Typo]} numberOfLines={1} ellipsizeMode="tail">{userInfo?.introduction ?? '소개글 없음'}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    itemLayout: {
        height: 29,
        width: 257,
        left: "50%",
        position: "absolute",
    },
    jenniferTypo: {
        textAlign: "center",
        fontWeight: "800",
        // left: "50%"
    },
    text2Typo: {
        fontSize: 20,
        color: "#000",
        position: "absolute"
    },
    iconLayout: {
        maxHeight: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        position: "absolute"
    },
    textTypo: {
        fontSize: 17,
        top: 0,
        textAlign: "center",
        color: "#000",
    },
    view: {
        width: "100%",
        height: 223,
        // flex: 1
    },
    child: {
        height: "100%",
        // marginLeft: -166,
        top: "0%",
        bottom: "0%",
        boxShadow: "0px 0px 18px rgba(0, 0, 0, 0.08)",
        elevation: 18,
        borderRadius: 20,
        backgroundColor: "#ffd8e4",
        width: '100%',
        // left: "50%",
        position: "absolute"
    },
    view2: {
        marginLeft: -128,
        bottom: 11
    },
    item: {
        marginLeft: -128.5,
        bottom: 0,
        boxShadow: "0px 0px 10.2px #fff",
        elevation: 10.2,
        borderRadius: 15,
        backgroundColor: "#fff"
    },
    smallTalk: {
        bottom: 7,
        fontSize: 14,
        width: 139,
        height: 15,
        color: "#000",
        textAlign: "center",
        fontWeight: "800",
    },
    jennifer: {
        marginLeft: -40,
        top: 49,
        textAlign: "center",
        fontWeight: "800",
        left: "50%",
        fontSize: 20
    },
    inner: {
        height: "56.05%",
        width: "37.65%",
        top: "-40.36%",
        right: "31.02%",
        bottom: "84.3%",
        left: "31.33%"
    },
    parent: {
        height: 20,
        position: "absolute"
    },
    text: {
        left: 0
    },
    safeareaviewText: {
        // left: 154
    },
    phoneCall: {
        top: 15,
        left: 280,
        width: 29,
        overflow: "hidden",
        height: 29,
        position: "absolute"
    },
    icon: {
        height: "87.24%",
        width: "86.9%",
        top: "4.17%",
        right: "4.3%",
        bottom: "8.59%",
        left: "8.8%",
        color: "#5a5a5a"
    },
    text2: {
        top: 84,
        // left: 128,
        textAlign: "left",
        fontSize: 20
    }
});