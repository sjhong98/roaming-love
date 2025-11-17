import CommentIcon from '@/assets/images/commentIcon.svg';
import HeartInactiveIcon from '@/assets/images/heartIcon.svg';
import HeartActiveIcon from '@/assets/images/heartActive.svg';
import SearchRedIcon from '@/assets/images/searchRed.svg';
import supabase from "@/db";
import useUser from '@/hooks/use-user';
import { Image } from "expo-image";
import { router } from "expo-router";
import { use, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowBack from '@/assets/images/arrowGray.svg';
import SearchIcon from '@/assets/images/searchGray.svg';

export default function ExploreSearch() {
    const [searchText, setSearchText] = useState('');

    return (
        <SafeAreaView>
            <View style={[styles.view, { paddingHorizontal: 21, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 7 }]}>
                <View style={styles.view5}>
                    <View style={[styles.view6, styles.viewPosition]} />
                    <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={[styles.view7, styles.viewPosition]}>
                        <ArrowBack width={24} height={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.view2}>
                    <View style={[styles.view3, styles.viewShadowBox, { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 13 }]}>
                        <View style={styles.search}>
                            <SearchIcon style={[styles.icon, styles.iconClr, { marginTop: -2 }]} />
                        </View>
                        <TextInput
                            style={[styles.text, { color: searchText ? '#000' : '#999', flex: 1 }]}
                            placeholder="원하는 그룹, 글을 찾아보세요"
                            placeholderTextColor="#999"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    parent: {
        flex: 1
    },
    viewShadowBox: {
        backgroundColor: "#fff",
        elevation: 9.1,
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)"
    },
    viewBorder: {
        borderColor: "#999",
        borderStyle: "solid",
        backgroundColor: "rgba(255, 255, 255, 0)"
    },
    viewPosition: {
        marginLeft: -25,
        width: 50,
        borderRadius: 20,
        left: "50%",
        top: 0,
        position: "absolute",
        height: 50
    },
    iconClr: {
        color: "#999",
        position: "absolute"
    },
    view: {
        width: "100%",
        height: 50,
    },
    view2: {
        width: Dimensions.get('window').width - 99,
        height: 50
    },
    view3: {
        borderRadius: 20,
        width: '100%',
        height: 50,
    },
    view4: {
        borderRadius: 20,
        width: '100%',
        height: 50
    },
    view5: {
        width: 50,
        top: 0,
        height: 50
    },
    view6: {
        backgroundColor: "#fff",
        elevation: 9.1,
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)"
    },
    view7: {
        borderColor: "#999",
        borderStyle: "solid",
        backgroundColor: "rgba(255, 255, 255, 0)",
        justifyContent: 'center',
        alignItems: 'center'
    },
    search: {
        width: 24,
        height: 24,
        overflow: "hidden",
    },
    icon: {
        height: "75%",
        width: "75%",
        top: "12.5%",
        right: "12.5%",
        bottom: "12.5%",
        left: "12.5%",
        maxWidth: "100%",
        maxHeight: "100%",
        overflow: "hidden"
    },
    text: {
        fontSize: 12,
        fontWeight: "700",
        fontFamily: "NanumSquare Neo OTF",
        textAlign: "left"
    }
});
