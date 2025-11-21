import supabase, { AsyncStorageAdapter } from '@/db';
import useUser from '@/hooks/use-user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { Alert, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { CustomText as Text } from '@/components/CustomText';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowLeftIcon from '@/assets/images/arrowGray.svg';

export default function My() {
    const { user } = useUser();

    const [tripType, setTripType] = useState<string | undefined>(undefined);
    const [loveType, setLoveType] = useState<string | undefined>(undefined);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [profileNickname, setProfileNickname] = useState<string>('');
    const [profileNicknameAdjusted, setProfileNicknameAdjusted] = useState<boolean>(false);
    const [profileIntroduction, setProfileIntroduction] = useState<string>('');
    const [profileIntroductionAdjusted, setProfileIntroductionAdjusted] = useState<boolean>(false);

    const nicknameInputRef = useRef<TextInput>(null);
    const introductionInputRef = useRef<TextInput>(null);

    useEffect(() => {
        (async () => {
            if (!user) return;

            AsyncStorage.getItem(`${user?.pk}_tripType`).then((value) => {
                if (value) setTripType(value);
            });
            AsyncStorage.getItem(`${user?.pk}_loveType`).then((value) => {
                if (value) setLoveType(value);
            });
            if (user?.image) {
                setProfileImage(user.image);
            }

            if (!user) return

            console.log('\n\n\nuser', user)
            setProfileNickname(user.name);
            setProfileIntroduction(user.introduction);
        })()
    }, [user])

    const handleLogOut = async () => {
        await AsyncStorageAdapter.removeItem('userInfo');
        router.push('/?login=true');
    }

    const changeProfileImage = async () => {
        try {
            // 권한 요청
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('권한 필요', '사진을 선택하려면 미디어 라이브러리 접근 권한이 필요해요.');
                return;
            }

            // 갤러리 열기
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: false,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                setProfileImage(selectedImage.uri);

                // 이미지를 Supabase Storage에 업로드
                if (user?.pk) {
                    try {
                        // 이미지를 base64로 읽기
                        const base64Data = await FileSystem.readAsStringAsync(selectedImage.uri, {
                            encoding: 'base64' as any,
                        });

                        // base64를 Uint8Array로 변환
                        const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
                        const byteCharacters = atob(base64String);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let j = 0; j < byteCharacters.length; j++) {
                            byteNumbers[j] = byteCharacters.charCodeAt(j);
                        }
                        const uint8Array = new Uint8Array(byteNumbers);

                        // 파일명 생성
                        const fileName = `profile_${user.pk}_${Date.now()}.jpg`;

                        // Supabase Storage에 업로드
                        const { data: uploadData, error: uploadError } = await supabase.storage
                            .from('roaming-love')
                            .upload(fileName, uint8Array, {
                                contentType: 'image/jpeg',
                                upsert: false
                            });

                        if (uploadError) {
                            console.error('업로드 에러:', uploadError);
                            Alert.alert('오류', '이미지 업로드에 실패했습니다.');
                            return;
                        }

                        // 공개 URL 가져오기
                        const { data: publicUrlData } = await supabase.storage
                            .from('roaming-love')
                            .getPublicUrl(uploadData.path);

                        const imageUrl = publicUrlData.publicUrl;

                        // 사용자 정보 업데이트
                        const { error: updateError } = await supabase
                            .from('user')
                            .update({ image: imageUrl })
                            .eq('pk', user.pk);

                        if (updateError) console.log(updateError)

                        if (updateError) {
                            console.error('업데이트 에러:', updateError);
                            Alert.alert('오류', '프로필 이미지 업데이트에 실패했습니다.');
                            return;
                        }

                        // 로컬 스토리지의 사용자 정보도 업데이트
                        const updatedUser = { ...user, image: imageUrl };
                        await AsyncStorageAdapter.setItem('userInfo', JSON.stringify(updatedUser));
                        setProfileImage(imageUrl);

                        // Alert.alert('성공', '프로필 이미지가 업데이트되었습니다.');
                    } catch (error) {
                        console.error('이미지 업로드 중 에러:', error);
                        Alert.alert('오류', '이미지를 업로드하는 중 오류가 발생했습니다.');
                    }
                }
            }
        } catch (error) {
            console.error('이미지 선택 중 에러:', error);
            Alert.alert('오류', '이미지를 불러오지 못했습니다.');
        }
    }

    const handleProfileNicknameAdjust = async () => {
        console.log('handleProfileNicknameAdjust')

        if (!user) return;

        await supabase.from('user').update({ name: profileNickname }).eq('pk', user?.pk);
        let newUser = { ...user, name: profileNickname };
        await AsyncStorageAdapter.setItem('userInfo', JSON.stringify(newUser));
        setProfileNicknameAdjusted(false);
        nicknameInputRef.current?.blur();
    }

    const handleProfileIntroductionAdjust = async () => {
        console.log('handleProfileIntroductionAdjust')

        if (!user) return;

        await supabase.from('user').update({ introduction: profileIntroduction }).eq('pk', user?.pk);
        let newUser = { ...user, introduction: profileIntroduction };
        await AsyncStorageAdapter.setItem('userInfo', JSON.stringify(newUser));
        setProfileIntroductionAdjusted(false);
        introductionInputRef.current?.blur();
    }

    return (
        <>
            <View style={{ paddingTop: 70, backgroundColor: '#fff', width: '100%', height: 0, zIndex: 1000, position: 'absolute', top: 0, left: 0, right: 0, paddingBottom: 0 }}>
                <View style={topStyles.view0}>
                    {/* <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 21, top: -5, zIndex: 9999, padding: 5 }}>
                        <ArrowLeftIcon width={24} height={24} />
                    </TouchableOpacity> */}
                    <TouchableOpacity activeOpacity={1} style={{ position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                        // AsyncStorage.removeItem(`${user?.pk}_tripType`);
                        // AsyncStorage.removeItem(`${user?.pk}_loveType`);
                    }}>
                        <Text style={topStyles.text}>마이페이지</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <SafeAreaView style={{ paddingHorizontal: 20, paddingTop: 70, gap: 20, flex: 1, position: 'relative' }}>
                <View style={{ width: '100%', flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                    <TouchableOpacity onPress={changeProfileImage}>
                        <Image
                            source={profileImage || user?.image || require('@/assets/images/userIcon.png')}
                            style={{ width: 70, height: 70, borderRadius: 100 }}
                        />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity 
                            onPress={() => {
                                if (tripType) {
                                    router.push({
                                        pathname: '/viewResult',
                                        params: { testType: 'trip', type: tripType }
                                    });
                                }
                            }}
                            disabled={!tripType}
                            style={{ boxShadow: '0px 2px 19.1px rgba(0, 0, 0, 0.3)', elevation: 7.4, backgroundColor: '#FF5878', paddingVertical: 10, borderRadius: 15, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, opacity: tripType ? 1 : 0.5 }}>
                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 400 }}>여행 타입</Text>
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{tripType || '타입 없음'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => {
                                if (loveType) {
                                    router.push({
                                        pathname: '/viewResult',
                                        params: { testType: 'love', type: loveType }
                                    });
                                }
                            }}
                            disabled={!loveType}
                            style={{ boxShadow: '0px 2px 19.1px rgba(0, 0, 0, 0.3)', elevation: 7.4, backgroundColor: '#FF5878', paddingVertical: 10, borderRadius: 15, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, opacity: loveType ? 1 : 0.5 }}>
                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 400 }}>연애 타입</Text>
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{loveType || '타입 없음'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ gap: 10 }}>
                    <View style={{ width: '100%', position: 'relative', gap: 4 }}>
                        <Text style={{ fontSize: 12, marginLeft: 8, color: '#444' }}>이름</Text>
                        <TextInput
                            ref={nicknameInputRef}
                            value={profileNickname}
                            onChangeText={(text) => {
                                setProfileNickname(text);
                                setProfileNicknameAdjusted(true);
                            }}
                            placeholder="이름을 입력해주세요."
                            placeholderTextColor="#999"
                            style={{ width: '100%', height: 50, backgroundColor: '#eee', borderRadius: 15, padding: 10 }}
                        />
                        {
                            profileNicknameAdjusted && (
                                <TouchableOpacity
                                    onPress={handleProfileNicknameAdjust}
                                    style={{ backgroundColor: '#FF5878', padding: 10, borderRadius: 15, alignItems: 'center', position: 'absolute', right: 10, top: 23 }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>저장</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                    <View style={{ width: '100%', position: 'relative', gap: 4 }}>
                        <Text style={{ fontSize: 12, marginLeft: 8, color: '#444' }}>한줄 소개</Text>
                        <TextInput
                            ref={introductionInputRef}
                            value={profileIntroduction}
                            onChangeText={(text) => {
                                setProfileIntroduction(text);
                                setProfileIntroductionAdjusted(true);
                            }}
                            placeholder="한줄 소개글을 입력해주세요."
                            placeholderTextColor="#999"
                            style={{ width: '100%', height: 50, backgroundColor: '#eee', borderRadius: 15, padding: 10 }}
                        />
                        {
                            profileIntroductionAdjusted && (
                                <TouchableOpacity
                                    onPress={handleProfileIntroductionAdjust}
                                    style={{ backgroundColor: '#FF5878', padding: 10, borderRadius: 15, alignItems: 'center', position: 'absolute', right: 10, top: 23 }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>저장</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/myArticles')}
                        style={{ backgroundColor: '#FF5878', padding: 10, borderRadius: 15, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>내 글 보기</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, paddingHorizontal: 20 }}>
                    <TouchableOpacity
                        onPress={handleLogOut}
                        style={{ backgroundColor: '#FF5878', padding: 10, borderRadius: 15, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>로그아웃</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
}

const topStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    textTypo1: {
        fontSize: 17,
        top: 37,
        textAlign: "center",
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
