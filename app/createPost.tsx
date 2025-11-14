import { Animated, Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChangeEachOtherIcon from '@/assets/images/changeEachOther.svg';
import CalendarIcon from '@/assets/images/calendarRed.svg';
import { useEffect, useRef, useState } from "react";
import { Image, ImageSource } from "expo-image";
import LocationCard from "@/components/ui/LocationCard";
import SearchRedIcon from '@/assets/images/searchRed.svg';
import LocationSelect from "@/components/trip/LocationSelect";
import DateSelect from "@/components/trip/DateSelect";
import { changeToThreeLetter } from "@/utils/changeToThreeLetter";
import dayjs from "dayjs";
import SettingIcon from '@/assets/images/settingIcon.svg';
import TypeSelect from "@/components/trip/TypeSelect";
import UserDummy from "@/constants/UserDummy";
import CreateIcon from '@/assets/images/createIcon.svg';
import SendIcon from '@/assets/images/sendIcon.svg';
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArrowGray from '@/assets/images/arrowGray.svg';
import HeartInactiveIcon from '@/assets/images/heartIcon.svg';
import HeartActiveIcon from '@/assets/images/heartActive.svg';
import CommentIcon from '@/assets/images/commentIcon.svg';
import ImageIcon from '@/assets/images/imageIcon.svg';
import * as ImagePicker from 'expo-image-picker';

export default function CreatePost() {
    const [content, setContent] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const handlePickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('권한 필요', '사진을 업로드하려면 미디어 라이브러리 접근 권한이 필요해요.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 1,
                selectionLimit: 5,
            });

            if (!result.canceled && result.assets) {
                const uris = result.assets.map((asset: ImagePicker.ImagePickerAsset) => asset.uri);
                setSelectedImages(uris);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('오류', '이미지를 불러오지 못했습니다.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={headerStyles.view}>
                    <TouchableOpacity onPress={() => router.back()}>
                    <Text style={[headerStyles.text, headerStyles.textTypo, { marginLeft: 10 }]}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={headerStyles.liquidGlassRegularMediu}>
                        <View style={[headerStyles.glassEffect, headerStyles.fillPosition]}>
                            <Text style={[headerStyles.text2, headerStyles.textTypo]}>게시하기</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 20, marginTop: 10, }}>
                    <Image source={require('@/assets/images/userIcon.png')} style={{ width: 45, height: 45, borderRadius: 20 }} />
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder="무슨 일이 일어나고 있나요?"
                        placeholderTextColor="#999"
                        multiline
                        style={{
                            flex: 1,
                            marginLeft: 12,
                            padding: 0,
                            fontSize: 15,
                            lineHeight: 22,
                            fontFamily: 'Pretendard',
                            color: '#000',
                            backgroundColor: 'transparent',
                            textAlignVertical: 'top',
                            marginTop: 10
                        }}
                    />
                </View>
                {selectedImages.length > 0 && (
                    <ScrollView horizontal style={{ width: '100%', paddingHorizontal: 20, marginTop: 20, gap: 10 }} contentContainerStyle={{ gap: 12 }}>
                        {selectedImages.map((uri, index) => (
                            <Image key={index} source={{ uri }} style={{ width: 80, height: 80, borderRadius: 12 }} contentFit="cover" />
                        ))}
                    </ScrollView>
                )}
                <View style={{ width: '100%', height: 49, position: 'absolute', bottom: 0, paddingHorizontal: 17, paddingVertical: 11, borderColor: "#b3b3b3", borderTopWidth: 0.5, backgroundColor: '#fff' }}>
                    <TouchableOpacity onPress={handlePickImage} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={[uploadImageStyles.image, uploadImageStyles.iconPosition]}>
                            <ImageIcon style={[uploadImageStyles.icon, uploadImageStyles.iconPosition]} />
                        </View>
                        <Text style={uploadImageStyles.text}>사진</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const uploadImageStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    iconPosition: {
        // overflow: "hidden",
        // position: "absolute"
    },
    view: {
        width: "100%",
        height: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 10,
        lineHeight: 12,
        fontWeight: "600",
        fontFamily: "Pretendard",
        color: "#999",
        textAlign: "center",
    },
    image: {
        top: 0,
        left: 0,
        width: 24,
        height: 24
    },
    icon: {
        height: 24,
        width: 24,
        color: "#8e8e93"
    }
});


const headerStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    textTypo: {
        textAlign: "left",
        color: "#000",
        fontFamily: "Pretendard",
        fontWeight: "500",
        lineHeight: 22,
    },
    fillPosition: {
        bottom: 0,
        right: 0,
        borderRadius: 34,
        top: 0,
        left: 0,
        position: "absolute"
    },
    view: {
        width: "100%",
        height: 43,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    text: {
        fontSize: 15,
        textAlign: "left",
        color: "#000",
        fontFamily: "Pretendard",
        fontWeight: "500",
        lineHeight: 22
    },
    liquidGlassRegularMediu: {
        width: 87,
        height: 33
    },
    shadow: {
        top: -26,
        right: -26,
        bottom: -26,
        left: -26,
        position: "absolute"
    },
    blur: {
        top: 31,
        right: 26,
        bottom: 21,
        left: 26,
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        borderRadius: 34,
        position: "absolute"
    },
    fill: {
        backgroundColor: "#262626"
    },
    glassEffect: {
        backgroundColor: "#FFB1C0"
    },
    text2: {
        top: 6,
        left: 21,
        fontSize: 13
    }
});