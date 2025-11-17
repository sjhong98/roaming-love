import { Animated, Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
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
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import supabase from "@/db";
import useUser from "@/hooks/use-user";

// React Native에서는 expo-file-system을 사용하여 파일을 base64로 읽기
async function readFileAsBase64(uri: string): Promise<string> {
    try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64' as any,
        });
        // MIME 타입 추정 (확장자 기반)
        const extension = uri.split('.').pop()?.toLowerCase() || 'png';
        const mimeType = extension === 'jpg' || extension === 'jpeg'
            ? 'image/jpeg'
            : extension === 'png'
                ? 'image/png'
                : 'image/png';
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.error('파일 읽기 실패:', error);
        throw error;
    }
}

// 이미지를 2MB 이하로 압축하는 함수
async function compressImage(uri: string): Promise<string> {
    const TARGET_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_WIDTH = 1920; // 최대 너비
    
    try {
        // 먼저 원본 이미지 크기 확인
        let base64Data = await readFileAsBase64(uri);
        const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
        const byteCharacters = atob(base64String);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
        }
        
        // 이미 2MB 이하면 그대로 반환
        if (byteArray.length <= TARGET_SIZE) {
            return uri;
        }
        
        // 이미지 정보 가져오기
        const manipulatorResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: MAX_WIDTH } }], // 최대 너비로 리사이즈
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG } // JPEG로 변환하고 품질 0.8로 시작
        );
        
        // 압축된 이미지 크기 확인
        let compressedBase64 = await readFileAsBase64(manipulatorResult.uri);
        let compressedBase64String = compressedBase64.includes(',') 
            ? compressedBase64.split(',')[1] 
            : compressedBase64;
        let compressedByteArray = new Uint8Array(atob(compressedBase64String).length);
        for (let i = 0; i < atob(compressedBase64String).length; i++) {
            compressedByteArray[i] = atob(compressedBase64String).charCodeAt(i);
        }
        
        // 2MB 이하가 될 때까지 품질을 낮춰가며 압축
        const qualitySteps = [0.6, 0.4, 0.2, 0.1];
        let currentUri = manipulatorResult.uri;
        
        for (const quality of qualitySteps) {
            if (compressedByteArray.length <= TARGET_SIZE) {
                break;
            }
            
            // 이전 압축 결과를 사용하여 다음 품질로 압축
            const result = await ImageManipulator.manipulateAsync(
                currentUri,
                [], // 리사이즈는 이미 했으므로 생략
                { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
            );
            
            currentUri = result.uri;
            compressedBase64 = await readFileAsBase64(result.uri);
            compressedBase64String = compressedBase64.includes(',') 
                ? compressedBase64.split(',')[1] 
                : compressedBase64;
            compressedByteArray = new Uint8Array(atob(compressedBase64String).length);
            for (let i = 0; i < atob(compressedBase64String).length; i++) {
                compressedByteArray[i] = atob(compressedBase64String).charCodeAt(i);
            }
        }
        
        // 최종 크기 확인
        if (compressedByteArray.length > TARGET_SIZE) {
            console.warn(`이미지가 2MB 이하로 압축되지 않았습니다. 현재 크기: ${(compressedByteArray.length / 1024 / 1024).toFixed(2)}MB`);
        }
        
        return currentUri;
    } catch (error) {
        console.error('이미지 압축 실패:', error);
        // 압축 실패 시 원본 반환
        return uri;
    }
}

export default function CreatePost() {
    const { user } = useUser();
    const [content, setContent] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

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

    const handleUpload = async () => {
        if(!user) return;

        setUploading(true);

        // upload image
        try {
            let uploadedImages: any = [...selectedImages];

            await Promise.all(
                uploadedImages.map(async (source: string, i: number) => {
                    // create random string
                    const chars =
                        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                    let result = ''
                    for (let i = 0; i < 10; i++) {
                        result += chars.charAt(Math.floor(Math.random() * chars.length))
                    }

                    // 이미지 압축 (파일 URI인 경우만)
                    let imageUri = source;
                    // if (!source.startsWith('data:')) {
                    //     // 파일 URI인 경우 압축 수행
                    //     imageUri = await compressImage(source);
                    // }

                    // 파일을 base64로 읽기
                    let base64Data: string;
                    if (imageUri.startsWith('data:')) {
                        // 이미 base64 데이터 URI인 경우
                        base64Data = imageUri;
                    } else {
                        // 파일 URI인 경우 읽어서 변환
                        base64Data = await readFileAsBase64(imageUri);
                    }

                    // base64에서 데이터 부분만 추출
                    const base64String = base64Data.includes(',')
                        ? base64Data.split(',')[1]
                        : base64Data;

                    if (!base64String) {
                        throw new Error('유효하지 않은 이미지 데이터입니다.');
                    }

                    // base64를 ArrayBuffer로 변환
                    const byteCharacters = atob(base64String);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let j = 0; j < byteCharacters.length; j++) {
                        byteNumbers[j] = byteCharacters.charCodeAt(j);
                    }
                    const byteArray = new Uint8Array(byteNumbers);

                    const MAX_SIZE = 10 * 1024 * 1024;
                    if (byteArray.length > MAX_SIZE) {
                        throw new Error('파일이 10MB를 초과했습니다.');
                    }

                    // 압축된 이미지는 JPEG 형식이므로 확장자와 contentType 변경
                    const isCompressed = !source.startsWith('data:') && imageUri !== source;
                    const fileExtension = isCompressed ? 'jpg' : 'png';
                    const contentType = isCompressed ? 'image/jpeg' : 'image/png';
                    
                    const fileName = `${new Date().toISOString()}_${result}.${fileExtension}`;
                    const { data, error } = await supabase.storage
                        .from('roaming-love')
                        .upload(fileName, byteArray, {
                            contentType: contentType,
                            upsert: false
                        });

                    if (error) {
                        console.log('\n\n\n에러발생 \n\n\n');
                        throw new Error(`${error}`);
                    }

                    const { path } = data;

                    const { data: publicUrlData } = await supabase.storage
                        .from('roaming-love')
                        .getPublicUrl(path);

                    uploadedImages[i] = publicUrlData.publicUrl
                })
            )

            const result = await supabase.from('post').insert({
                content: content,
                image: uploadedImages.join('|SPLIT|'),
                user_pk: user.pk,
            }).select().single()

            console.log('done', result)

            router.replace('/(tabs)/explore')
        } catch (e) {
            console.log('\n\n\n에러발생\n\n\n')
            console.error(e)
        } finally {
            setUploading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={headerStyles.view}>
                    <TouchableOpacity onPress={() => router.back()} disabled={uploading}>
                        <Text style={[headerStyles.text, headerStyles.textTypo, { marginLeft: 10 }]}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={headerStyles.liquidGlassRegularMediu} onPress={handleUpload} disabled={uploading}>
                        <View style={[headerStyles.glassEffect, headerStyles.fillPosition]}>
                            {uploading ? (
                                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            ) : (
                                <Text style={[headerStyles.text2, headerStyles.textTypo]}>게시하기</Text>
                            )}
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
            </SafeAreaView>
            <View style={{ width: '100%', height: 49, position: 'absolute', bottom: 0, paddingHorizontal: 17, paddingVertical: 11, borderColor: "#b3b3b3", borderTopWidth: 0.5, backgroundColor: '#fff' }}>
                <TouchableOpacity onPress={handlePickImage} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[uploadImageStyles.image, uploadImageStyles.iconPosition]}>
                        <ImageIcon style={[uploadImageStyles.icon, uploadImageStyles.iconPosition]} />
                    </View>
                    <Text style={uploadImageStyles.text}>사진</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
        position: "absolute",
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